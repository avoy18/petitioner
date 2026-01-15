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
