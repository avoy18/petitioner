import { useEffect, useRef } from '@wordpress/element';

interface CodeEditorProps {
	title?: string;
	help?: string;
	code?: string;
	onChange?: (code: string) => void;
	/** We want to reinitialize it if the active tab is different on load so it calculates the styles correctly */
	isActive?: boolean;
}

export default function CodeEditor({ title = '', help = '', code = '', onChange, isActive = true }: CodeEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const onChangeRef = useRef(onChange);
	const editorRef = useRef<any>(null);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (window.wp?.codeEditor && textareaRef.current && !editorRef.current) {
			const editorConfig = { type: 'text/css' };
			editorRef.current = window.wp.codeEditor.initialize(textareaRef.current, editorConfig);

			if (editorRef.current?.codemirror) {
				let timeout: NodeJS.Timeout;
				editorRef.current.codemirror.on('change', () => {
					clearTimeout(timeout);
					timeout = setTimeout(() => {
						if (onChangeRef.current) {
							onChangeRef.current(editorRef.current.codemirror.getValue());
						}
					}, 500);
				});
			}
		}
	}, []);

	useEffect(() => {
		if (isActive && editorRef.current?.codemirror) {
			// A small delay ensures the container has finished rendering as visible
			setTimeout(() => {
				editorRef.current.codemirror.refresh();
			}, 0);
		}
	}, [isActive]);

	return (
		<div>
			<p>
				<h3>{title}</h3>
				<span>{help}</span>
			</p>
			<textarea
				ref={textareaRef}
				name="petitioner_custom_css"
				id="petitionerCode"
				rows={10}
				cols={50}
				className="large-text code petitioner-code-editor"
				defaultValue={code}
			/>
		</div>
	);
}
