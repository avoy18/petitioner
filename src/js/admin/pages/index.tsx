import EditUI from '@admin/pages/EditUI';
import SettingsUI from '@admin/pages/SettingsUI';
import ComponentPreviewUI from '@admin/pages/ComponentPreviewUI';

function removeLoading() {
    const loadingElement = document.querySelector('.ptr-is-loading');

    if (loadingElement) {
        loadingElement.classList.remove('ptr-is-loading');
    }
}

export default function mountPages() {
    EditUI();
    SettingsUI();
    ComponentPreviewUI();
    removeLoading();
}