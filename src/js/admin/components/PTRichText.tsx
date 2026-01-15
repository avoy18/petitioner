import { useEffect, useRef } from '@wordpress/element';

export default function PTRichText({
	id = '',
	label = 'Rich text label',
	value = '',
	height = 300,
	help = '',
	plugins = 'lists link',
	toolbar = 'formatselect | bold italic | bullist numlist | link',
	onChange = (value) => {},
}: {
	id: string;
	label: string;
	value: any;
	height?: number;
	help?: any;
	plugins?: string;
	toolbar?: string;
	onChange: (value: string) => void;
}) {
	const editorRef = useRef<typeof tinymce.Editor | null>(null);
	const lastSavedValue = useRef(value);

	useEffect(() => {
		if (typeof window !== 'undefined' && typeof tinymce !== 'undefined') {
			tinymce.init({
				selector: `#${id}`,
				menubar: false,
				plugins,
				toolbar,
				relative_urls: false,
				block_formats:
					'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3',
				height,
				setup: (editor: any) => {
					editorRef.current = editor;

					editor.on('init', () => {
						if (value) {
							editor.setContent(value);
							lastSavedValue.current = value;
						}
					});

					editor.on('blur', () => {
						const content = editor.getContent();
						lastSavedValue.current = content;
						onChange(content);
					});
				},
			});
		}

		return () => {
			if (editorRef.current) {
				try {
					editorRef.current.remove();
				} catch (e) {
					console.warn('TinyMCE cleanup error:', e);
				}
				editorRef.current = null;
			}
		};
	}, [id, height, plugins, toolbar]);

	useEffect(() => {
		if (editorRef.current && value !== lastSavedValue.current) {
			editorRef.current.setContent(value || '');
			lastSavedValue.current = value;
		}
	}, [value]);

	return (
		<div className="petitioner-rich-text">
			<h4>{label}</h4>
			{help && <div className="help">{help}</div>}
			<textarea name={id} id={id}></textarea>
		</div>
	);
}
