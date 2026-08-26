type NonceResponse = {
    success?: boolean;
    data?: { nonce?: string };
};

export type FetchFreshNonceOptions = {
    nonceEndpoint: string;
    fallbackNonce?: string;
};

/**
 * Fetches a fresh frontend nonce. Falls back to the inline/cached nonce
 * when the endpoint is unavailable.
 */
async function fetchFreshNonceUncached({
    nonceEndpoint,
    fallbackNonce = '',
}: FetchFreshNonceOptions): Promise<string> {
    if (!nonceEndpoint) {
        if (fallbackNonce) return fallbackNonce;
        throw new Error('No nonce endpoint available');
    }

    try {
        const response = await fetch(nonceEndpoint, {
            method: 'GET',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch nonce');
        }

        const data = (await response.json()) as NonceResponse;

        if (data.success && data.data?.nonce) {
            return data.data.nonce;
        }

        throw new Error('Invalid nonce response');
    } catch (error) {
        console.warn('Could not fetch fresh nonce:', error);

        if (fallbackNonce) {
            return fallbackNonce;
        }

        throw new Error('No nonce available');
    }
}

const nonceRequests = new Map<string, Promise<string>>();

export function fetchFreshNonce(options: FetchFreshNonceOptions): Promise<string> {
    const { nonceEndpoint } = options;

    if (!nonceEndpoint) {
        return fetchFreshNonceUncached(options);
    }

    const existing = nonceRequests.get(nonceEndpoint);
    if (existing) return existing;

    const request = fetchFreshNonceUncached(options).finally(() => {
        nonceRequests.delete(nonceEndpoint);
    });

    nonceRequests.set(nonceEndpoint, request);
    return request;
}