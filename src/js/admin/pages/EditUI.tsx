import { createRoot } from '@wordpress/element';
import EditFields from '@admin/sections/EditFields';
import ShortcodeArea from '@admin/sections/ShortcodeArea';

export default function EditUI() {
    function FormArea() {
        return (
            <div>
                <ShortcodeArea />
                <EditFields />
            </div>
        );
    }

    const editorContainer = document.getElementById('petitioner-admin-form');

    if (editorContainer) {
        const editorRoot = createRoot(editorContainer);
        editorRoot.render(<FormArea />);
    }
}