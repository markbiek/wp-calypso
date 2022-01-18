import { getMediaQueryList, isMobile, MOBILE_BREAKPOINT } from '@automattic/viewport';
import { Button, Card, CardBody, CardFooter, CardMedia, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import minimize from '../icons/minimize';
import WpcomTourKitRating from './wpcom-tour-kit-rating';
import type { TourStepRenderer, TourStepRendererProps } from '@automattic/tour-kit';

const WpcomTourKitStep: TourStepRenderer = ( {
	steps,
	currentStepIndex,
	onDismiss,
	onNextStep,
	onPreviousStep,
	onMinimize,
	setInitialFocusedElement,
	onGoToStep,
} ) => {
	return (
		<WelcomeTourCard
			steps={ steps }
			currentStepIndex={ currentStepIndex }
			onDismiss={ onDismiss }
			onMinimize={ onMinimize }
			onGoToStep={ onGoToStep }
			onNextStep={ onNextStep }
			onPreviousStep={ onPreviousStep }
			setInitialFocusedElement={ setInitialFocusedElement }
		/>
	);
};

function WelcomeTourCard( {
	steps,
	currentStepIndex,
	onMinimize,
	onDismiss,
	onGoToStep,
	onNextStep,
	onPreviousStep,
	setInitialFocusedElement,
} ) {
	const lastStepIndex = steps.length - 1;
	const { descriptions, heading, imgSrc } = steps[ currentStepIndex ].meta;
	const isLastStep = currentStepIndex === lastStepIndex;

	const description = descriptions[ isMobile() ? 'mobile' : 'desktop' ] ?? descriptions.desktop;

	return (
		<Card className="welcome-tour-card" isElevated>
			<CardOverlayControls onDismiss={ onDismiss } onMinimize={ onMinimize } />
			{ /* TODO: Update selector for images in @wordpress/components/src/card/styles/card-styles.js */ }
			<CardMedia className="welcome-tour-card__media">
				<picture>
					{ imgSrc.mobile && (
						<source
							srcSet={ imgSrc.mobile.src }
							type={ imgSrc.mobile.type }
							media={ getMediaQueryList( MOBILE_BREAKPOINT )?.media }
						/>
					) }
					<img
						alt={ __( 'Editor Welcome Tour', 'full-site-editing' ) }
						src={ imgSrc.desktop?.src }
					/>
				</picture>
			</CardMedia>
			<CardBody>
				<h2 className="welcome-tour-card__heading">{ heading }</h2>
				<p className="welcome-tour-card__description">
					{ description }
					{ isLastStep ? (
						<Button
							className="welcome-tour-card__description"
							isTertiary
							onClick={ () => onGoToStep( 0 ) }
							ref={ setInitialFocusedElement }
						>
							{ __( 'Restart tour', 'full-site-editing' ) }
						</Button>
					) : null }
				</p>
			</CardBody>
			<CardFooter>
				{ isLastStep ? (
					<WpcomTourKitRating currentStepIndex={ currentStepIndex } config={ undefined } />
				) : (
					<CardNavigation
						currentStepIndex={ currentStepIndex }
						lastStepIndex={ lastStepIndex }
						onDismiss={ onDismiss }
						onGoToStep={ onGoToStep }
						onNextStep={ onNextStep }
						onPreviousStep={ onPreviousStep }
						setInitialFocusedElement={ setInitialFocusedElement }
					></CardNavigation>
				) }
			</CardFooter>
		</Card>
	);
}

function CardNavigation( {
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
					className="welcome-tour-card__next-btn"
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
		<div className="welcome-tour-card__overlay-controls">
			<Flex>
				<Button
					label={ __( 'Minimize Tour', 'full-site-editing' ) }
					isPrimary
					className="welcome-tour-card__minimize-icon"
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

export default WpcomTourKitStep;
