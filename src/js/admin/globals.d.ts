declare const ajaxurl: string;

declare const tinymce: {
	init: (options: {
		selector: string;
		menubar?: boolean;
		plugins?: string;
		toolbar?: string;
		relative_urls?: boolean;
		block_formats?: string;
		height?: number;
		setup?: (editor: tinymce.Editor) => void;
	}) => void;
};

declare namespace tinymce {
	interface Editor {
		on: (event: string, callback: () => void) => void;
		getContent: () => string;
		setContent: (content: string) => void;
		remove: () => void;
	}
}

interface Window {
	petitionerData: Record<string, unknown> & {
		form_fields?: Record<string, {
			fieldKey?: string;
			type: 'text' | 'email' | 'select' | 'checkbox' | 'wysiwyg' | 'date' | 'tel' | 'textarea' | 'submit';
			fieldName: string;
			label: string;
			required: boolean;
			removable: boolean;
			[key: string]: unknown;
		}>;
		field_order?: string[];
		builder_config?: {
			defaults: Record<string, {
				fieldKey?: string;
				type: 'text' | 'email' | 'select' | 'checkbox' | 'wysiwyg' | 'date' | 'tel' | 'textarea' | 'submit';
				fieldName: string;
				label: string;
				required: boolean;
				removable: boolean;
				placeholder?: string;
				value?: string | boolean | string[] | number;
				options?: string[];
				[key: string]: unknown;
			}>;
			draggable: {
				fieldKey?: string;
				type: 'text' | 'email' | 'select' | 'checkbox' | 'wysiwyg' | 'date' | 'tel' | 'textarea' | 'submit';
				fieldName: string;
				label: string;
				required: boolean;
				removable: boolean;
				placeholder?: string;
				value?: string | boolean | string[] | number;
				options?: string[];
				[key: string]: unknown;
			}[];
		};
	};
}
