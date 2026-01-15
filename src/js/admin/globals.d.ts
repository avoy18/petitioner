declare const ajaxurl: string;
declare const tinymce: {
	init: (options: any) => void;
	Editor: {
        remove: () => void;
        setContent: (content: string) => void;
    };
};