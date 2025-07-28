import { __ } from '@wordpress/i18n';
import ShortcodeElement from '@admin/components/ShortcodeElement';

export default function ShortCodeArea() {
	const formID = window?.petitionerData?.form_id;

	if (!formID) {
		return null;
	}

	return (
		<ShortcodeElement
			clipboardValue={`[petitioner-form id="${formID}"]`}
			label={__('Your Petitioner shortcode', 'petitioner')}
			help={__(
				'Use this shortcode on the frontend of your website to show the petition form',
				'petitioner'
			)}
			fieldName="petitioner_shortcode"
		/>
	);
}
