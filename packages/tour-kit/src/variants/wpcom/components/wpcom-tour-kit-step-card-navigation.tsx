import { Button, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import minimize from '../icons/minimize';
import type { TourStepRendererProps } from '@automattic/tour-kit';

function WpcomTourKitStepCardNavigation( {
	currentStepIndex,
	lastStepIndex,
	onDismiss,
	onGoToStep,
	onNextStep,
	onPreviousStep,
	setInitialFocusedElement,
} ) {
	// These are defined on their own lines because of a minification issue.
	// __('translations') do not always work correctly when used inside of ternary statements.
	const startTourLabel = __( 'Try it out!', 'full-site-editing' );
	const nextLabel = __( 'Next', 'full-site-editing' );

	return (
		<>
			<PaginationControl
				currentPage={ currentStepIndex }
				numberOfPages={ lastStepIndex + 1 }
				setCurrentPage={ onGoToStep }
			/>
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

function CardOverlayControls( {
	onMinimize,
	onDismiss,
}: {
	onMinimize: TourStepRendererProps[ 'onMinimize' ];
	onDismiss: TourStepRendererProps[ 'onDismiss' ];
} ) {
	return (
		<div className="wpcom-tour-kit-step-card__overlay-controls">
			<Flex>
				<Button
					label={ __( 'Minimize Tour', 'full-site-editing' ) }
					isPrimary
					className="wpcom-tour-kit-step-card__minimize-icon"
					icon={ minimize }
					iconSize={ 24 }
					onClick={ onMinimize }
				></Button>
				<Button
					label={ __( 'Close Tour', 'full-site-editing' ) }
					isPrimary
					icon={ close }
					iconSize={ 24 }
					onClick={ onDismiss( 'close-btn' ) }
				></Button>
			</Flex>
		</div>
	);
}

export default WpcomTourKitStepCardNavigation;
