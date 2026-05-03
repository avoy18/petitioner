import { applyFilters } from '@wordpress/hooks';
import { useEditFormContext } from '@admin/context/EditFormContext';

export default function IntegrationArea() {
    const { formState, updateFormState } = useEditFormContext();

    let IntegrationContent = <div>
        
    </div>;

    IntegrationContent = applyFilters(
        'petitioner.admin.sections.edit_fields.integration_content',
        IntegrationContent,
        formState,
        updateFormState
    ) as JSX.Element;

    return (
        <>
            {IntegrationContent}
        </>
    )
}