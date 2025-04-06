import { Draggable, Panel, PanelBody } from '@wordpress/components';
import { Icon, more } from '@wordpress/icons';

export default function FormBuilder(props) {
	return (
		<div className="ptr-form-builder">
			<div>
				<Panel header="Availabke fields">
					<PanelBody>
						<Draggable
							elementId="draggable-panel"
							transferData={{}}
						>
							{({ onDraggableStart, onDraggableEnd }) => (
								<div
									className="example-drag-handle"
									draggable
									onDragStart={onDraggableStart}
									onDragEnd={onDraggableEnd}
								>
									<Icon icon={more} /> Form field
								</div>
							)}
						</Draggable>
						<Draggable
							elementId="draggable-panel2"
							transferData={{}}
						>
							{({ onDraggableStart, onDraggableEnd }) => (
								<div
									className="example-drag-handle"
									draggable
									onDragStart={onDraggableStart}
									onDragEnd={onDraggableEnd}
								>
									<Icon icon={more} /> Form field 2
								</div>
							)}
						</Draggable>
					</PanelBody>
				</Panel>
			</div>
		</div>
	);
}
