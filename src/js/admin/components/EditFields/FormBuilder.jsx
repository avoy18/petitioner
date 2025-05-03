import { Draggable, Panel, PanelBody, Button } from '@wordpress/components';
import { Icon, more } from '@wordpress/icons';
import { useState } from 'react';
import { DropZone } from '@wordpress/components';

const MyDropZone = () => {
	const [hasDropped, setHasDropped] = useState(false);

	return (
		<div>
			{hasDropped ? 'Dropped!' : 'Drop something here'}
			<DropZone
				onFilesDrop={() => setHasDropped(true)}
				onHTMLDrop={() => setHasDropped(true)}
				onDrop={() => setHasDropped(true)}
			/>
		</div>
	);
};

const MyDraggable = ({ id, onDragStart, onDragEnd, children }) => {
	const [selected, setSelected] = useState(false);
	return (
		<div style={{ opacity: selected ? '0.5' : '1' }} id={id}>
			<Draggable
				elementId={id}
				transferData={{}}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				{({ onDraggableStart, onDraggableEnd }) => (
					<div
						className="example-drag-handle"
						draggable
						onDragStart={(event) => {
							setSelected(true);
							onDraggableStart(event);
						}}
						onDragEnd={(event) => {
							setSelected(false);
							onDraggableEnd(event);
						}}
					>
						{children}
					</div>
				)}
			</Draggable>
		</div>
	);
};

export default function FormBuilder(props) {
	const NameField = () => {
		return (
			<MyDraggable id="nameField">
				<div
					style={{
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '5px',
					}}
				>
					Your name
				</div>
			</MyDraggable>
		);
	};

	const EmailField = () => {
		return (
			<MyDraggable id="nameField">
				<div
					style={{
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '5px',
					}}
				>
					Your email
				</div>
			</MyDraggable>
		);
	};

	const DynamicField = ({
		name = '',
		type = 'text', // 'name', 'email', 'country', 'text', 'number', 'textarea', 'select', 'checkbox', 'radio'
		label = 'Field Label',
		placeholder = 'Placeholder',
		required = false,
	}) => {
		return (
			<MyDraggable id="nameField">
				<div
					style={{
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '5px',
					}}
				>
					{label}
				</div>
			</MyDraggable>
		);
	};

	return (
		<div
			className="ptr-form-builder"
			style={{ display: 'flex', flexDirection: 'row' }}
		>
			<div style={{ width: '70%' }}>
				<Panel header="Form">
					<PanelBody>
						<div className="ptr-field-wrapper">
							<span className="ptr-visual-position"></span>
							<DynamicField type="name" label="Name" />
							<span className="ptr-visual-position"></span>
							<DynamicField type="email" label="Your email" />
							<span className="ptr-visual-position"></span>
							<DynamicField type="country" label="Your country" />
							<span className="ptr-visual-position"></span>
							<div>
								<Button disabled={true} variant="primary">
									Sign this petition
								</Button>
							</div>
						</div>
					</PanelBody>
				</Panel>
			</div>
		</div>
	);
}
