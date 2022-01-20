import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { TourStepRendererProps } from '@automattic/tour-kit';

function WpcomTourKitStepCardNavigation( {
	currentStepIndex,
	lastStepIndex,
	onDismiss,
	onGoToStep,
	onNextStep,
	onPreviousStep,
	setInitialFocusedElement,
}: TourStepRendererProps ) {
	// These are defined on their own lines because of a minification issue.
	// __('translations') do not always work correctly when used inside of ternary statements.
	const startTourLabel = __( 'Try it out!', 'full-site-editing' );
	const nextLabel = __( 'Next', 'full-site-editing' );

	return (
		<>
			{ /* <PaginationControl
				currentPage={ currentStepIndex }
				numberOfPages={ lastStepIndex + 1 }
				setCurrentPage={ onGoToStep }
			/> */ }
			<div>
				{ currentStepIndex === 0 ? (
					<Button isTertiary={ true } onClick={ onDismiss( 'no-thanks-btn' ) }>
						{ __( 'Skip', 'full-site-editing' ) }
					</Button>
				) : (
					<Button isTertiary={ true } onClick={ onPreviousStep }>
						{ __( 'Back', 'full-site-editing' ) }
					</Button>
				) }

				<Button
					className="wpcom-tour-kit-step-card-navigation__next-btn"
					isPrimary={ true }
					onClick={ onNextStep }
					ref={ setInitialFocusedElement }
				>
					{ currentStepIndex === 0 ? startTourLabel : nextLabel }
				</Button>
			</div>
		</>
	);
}

export default WpcomTourKitStepCardNavigation;
