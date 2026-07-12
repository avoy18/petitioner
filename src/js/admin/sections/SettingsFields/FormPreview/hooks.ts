import { useRef, useState, useCallback, useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useSettingsFormContext } from "@admin/context/SettingsContext";
import { fetchPreviewCSS } from "./utilities";

export const useFormPreview = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { formState } = useSettingsFormContext();
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const petitions = useSelect((select) => {
        // @ts-ignore - core-data types might not be fully available
        return select('core').getEntityRecords('postType', 'petitioner-petition', {
            per_page: -1,
        });
    }, []);

    const [selectedFormId, setSelectedFormId] = useState(0);

    useEffect(() => {
        if (Array.isArray(petitions) && petitions.length > 0 && selectedFormId === 0) {
            setSelectedFormId(petitions[0].id);
        }
    }, [petitions, selectedFormId]);

    const syncPreview = useCallback(async () => {
        if (!iframeRef.current?.contentWindow) return;

        const targetOrigin = new URL(
            window.petitionerData?.home_url || '/',
            window.location.href
        ).origin;

        // 1. Send visibility updates instantly
        iframeRef.current.contentWindow.postMessage(
            { type: 'UPDATE_VISIBILITY', payload: formState },
            targetOrigin
        );

        // Cancel any pending CSS generation requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // 2. Fetch compiled CSS via AJAX
        fetchPreviewCSS({
            formState,
            abortSignal: abortControllerRef.current.signal,
            onSuccess: (css) => {
                iframeRef.current?.contentWindow?.postMessage(
                    { type: 'UPDATE_CSS', payload: css },
                    targetOrigin
                );
            },
            onError: (msg) => {
                console.error(msg);
            },
        });
    }, [formState]);

    // Sync settings to the iframe via AJAX + postMessage
    useEffect(() => {
        if (!iframeLoaded) return;

        // Debounce the AJAX call
        const timeout = setTimeout(() => {
            syncPreview();
        }, 300);

        return () => {
            clearTimeout(timeout);
            // Abort any in-flight request when unmounting OR when dependencies change
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }, [syncPreview, iframeLoaded]);

    const previewUrl = `${window.petitionerData?.home_url || '/'}?petitioner_live_preview=1&form_id=${selectedFormId}`;

    return {
        iframeRef,
        setIframeLoaded,
        previewUrl,
        selectedFormId,
        setSelectedFormId,
        petitions,
        syncPreview,
    }
}