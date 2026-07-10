import { useEffect, useRef } from '@wordpress/element';

interface CodeEditorProps {
	title?: string;
	help?: string;
	code?: string;
	onChange?: (code: string) => void;
}

export default function CodeEditor({ title = '', help = '', code = '', onChange }: CodeEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const initializedRef = useRef(false);

	useEffect(() => {
		if (window.wp?.codeEditor && textareaRef.current && !initializedRef.current) {
			initializedRef.current = true;
			
			const editorConfig = { type: 'text/css' };
			const editorInstance = window.wp.codeEditor.initialize(textareaRef.current, editorConfig);
			
			if (onChange && editorInstance?.codemirror) {
				let timeout: NodeJS.Timeout;
				editorInstance.codemirror.on('change', () => {
					clearTimeout(timeout);
					timeout = setTimeout(() => {
						onChange(editorInstance.codemirror.getValue());
					}, 500);
				});
			}
		}
	}, [onChange]);

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
