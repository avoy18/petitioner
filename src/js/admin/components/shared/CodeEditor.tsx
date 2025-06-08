export default function CodeEditor({ title = '', help = '', code = '' }) {
	return (
		<div>
			<p>
				<h3>{title}</h3>
				<span>{help}</span>
			</p>
			<textarea
				name="petitioner_custom_css"
				id="petitionerCode"
				rows={10}
				cols={50}
				className="large-text code petitioner-code-editor"
			>
				{code}
			</textarea>
		</div>
	);
}
