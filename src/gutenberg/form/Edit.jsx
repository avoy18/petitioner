import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';

import {
    TextControl,
    SelectControl, PanelBody
} from '@wordpress/components';

const continents = [
    'Africa',
    'America',
    'Antarctica',
    'Asia',
    'Europe',
    'Oceania',
];

export default function Edit({ attributes, setAttributes }) {
    const { formId, newPetitionLink } = attributes;
    const blockAtts = useBlockProps();

    const allPetitions =
        useSelect((select) => {
            return select('core').getEntityRecords(
                'postType',
                'petitioner-petition',
                {
                    per_page: -1,
                    _fields: 'title,id',
                }
            );
        }, []) || [];

    const petitionOptions = [];

    allPetitions.forEach((el) => {

        let label = el.title.raw;

        const limit = 40;

        if (label.length > limit) {
            label = label.substring(0, limit) + '...';
        }

        const objToPush = { label, value: el.id };

        petitionOptions.push(objToPush);
    });

    const FinalCompontnt = () => {
        if (!allPetitions.length) {
            return <div style={
                {
                    padding: '24px',
                    background: '#efefef'
                }
            }>
                <p> <small>Petitioner form</small></p>
                <p>Looks like you haven't added any forms yet!</p>
                <Button variant="secondary" href={newPetitionLink || ''}>
                    Create your first petition
                </Button>
            </div>
        }

        if (!formId) {
            return <div style={
                {
                    padding: '24px',
                    background: '#efefef'
                }
            }>
                <p> <small>Petitioner form</small></p>
                <p>Use the dropdown in the block settings to select your petiton.</p>
            </div>
        }

        return <div style={{ pointerEvents: "none" }}>
            <ServerSideRender
                block="petitioner/form"
                attributes={attributes}
            />
        </div>

    }

    return <div {...blockAtts}>
        <InspectorControls>
            <PanelBody>
                <SelectControl
                    label="Selected Petition"
                    value={formId}
                    options={petitionOptions}
                    onChange={(el) => setAttributes({ formId: el })
                    }
                />

            </PanelBody>

        </InspectorControls>

        <FinalCompontnt />


    </div>
}