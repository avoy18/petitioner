import { createRoot } from '@wordpress/element';
import ComponentPreview from '@admin/sections/ComponentPreviewArea';

export default function ComponentPreviewUI() {
    const componentPreviewContainer = document.getElementById('petitioner-component-preview');
    if (componentPreviewContainer) {
        const componentPreviewRoot = createRoot(componentPreviewContainer);
        componentPreviewRoot.render(<ComponentPreview />);
    }
}