import type { SubmissionRendererConstructor } from './consts';

class SubmissionRegistry {
    private renderers = new Map<string, SubmissionRendererConstructor>();

    add(name: string, Renderer: SubmissionRendererConstructor): void {
        this.renderers.set(name, Renderer);
    }

    get(name: string): SubmissionRendererConstructor | undefined {
        return this.renderers.get(name);
    }

    getAll(): string[] {
        return [...this.renderers.keys()];
    }
}

export const submissionRegistry = new SubmissionRegistry();

declare global {
    interface Window {
        petitionerSubmissionRegistry: SubmissionRegistry;
    }
}

window.petitionerSubmissionRegistry = submissionRegistry;