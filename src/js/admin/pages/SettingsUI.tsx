import { createRoot } from '@wordpress/element';
import SettingsFields from '@admin/sections/SettingsFields';

export default function SettingsUI() {
    const settingsContainer = document.getElementById(
        'petitioner-settings-admin-form'
    );

    if (settingsContainer) {
        const submissionsRoot = createRoot(settingsContainer);
        submissionsRoot.render(<SettingsFields />);
    }
}
