import { useEffect, useRef } from '@wordpress/element';

export default function PTRichText({
	id,
	label = 'Rich text label',
	value = '',
	height = 300,
	help,
	onChange = () => true,
}) {
	const editorRef = useRef(null);
	const lastSavedValue = useRef(value);

	useEffect(() => {
		if (typeof window !== 'undefined' && typeof tinymce !== 'undefined') {
			tinymce.init({
				selector: `#${id}`,
				menubar: false,
				plugins: 'lists link',
				toolbar: 'formatselect | bold italic | bullist numlist | link',
				block_formats:
					'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3',
				height,
				setup: (editor) => {
					editorRef.current = editor;

					// ✅ Set initial content only once
					editor.on('init', () => {
						if (value) {
							editor.setContent(value);
							lastSavedValue.current = value;
						}
					});

					editor.on('blur', () => {
						const content = editor.getContent();
						onChange(content);
					});
				},
			});
		}

		// ✅ Cleanup TinyMCE instance when unmounting
		return () => {
			if (editorRef.current) {
				editorRef.current.remove();
				editorRef.current = null;
			}
		};
	}, [id, value]);

	return (
		<div className="petitioner-rich-text">
			<h4>{label}</h4>
			{help && <div className="help">{help}</div>}
			<textarea name={id} id={id}></textarea>
		</div>
	);
}
