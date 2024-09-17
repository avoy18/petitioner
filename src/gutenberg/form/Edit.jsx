import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import {
    TextControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { formId } = attributes;
    const blockAtts = useBlockProps();
    console.log(attributes);
    return <div>
        <InspectorControls>
            <TextControl type="number" value={formId} onChange={(newId) => setAttributes({ formId: newId })} />
        </InspectorControls>

        <ServerSideRender
            block="petitioner/form"
            attributes={attributes}
        />

    </div>
}