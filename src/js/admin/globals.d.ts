declare const ajaxurl: string;

declare const tinymce: {
	init: (options: {
		selector: string;
		menubar?: boolean;
		plugins?: string;
		toolbar?: string;
		relative_urls?: boolean;
		remove_script_host?: boolean;
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
		form_fields?: Record<string, unknown>;
		field_order?: string[];
		builder_config?: {
			defaults: Record<string, unknown>;
			draggable: unknown[];
		};
	};
}
