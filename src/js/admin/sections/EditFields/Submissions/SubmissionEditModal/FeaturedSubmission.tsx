import { __ } from '@wordpress/i18n';
import { StyledFeaturedButtonWrapper, StyledFeatureButton, HelpText } from './styled';

type FeaturedSubmissionProps = {
    isFeatured: boolean;
    onToggle: () => void;
}

type FinalButtonProps = {
    icon: 'star-empty' | 'star-filled';
    text: string;
}

export default function FeaturedSubmission({
    isFeatured,
    onToggle,
}: FeaturedSubmissionProps) {
    const buttonProps: FinalButtonProps = {
        icon: 'star-empty',
        text: __('Feature this submission', 'petitioner'),
    }

    if (isFeatured) {
        buttonProps.icon = 'star-filled'
        buttonProps.text = __('Unfeature this submission', 'petitioner')
    }

    return (
        <StyledFeaturedButtonWrapper>
            <StyledFeatureButton
                variant="tertiary"
                icon={buttonProps.icon}
                onClick={onToggle}
                size="small"
            >
                {buttonProps.text}
            </StyledFeatureButton>
            <HelpText variant="muted" size="12px">
                {__('Featured submissions get pinned at the top', 'petitioner')}
            </HelpText>
        </StyledFeaturedButtonWrapper>
    );
}
