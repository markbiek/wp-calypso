import { getMediaQueryList, isMobile, MOBILE_BREAKPOINT } from '@automattic/viewport';
import { Button, Card, CardBody, CardFooter, CardMedia, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import minimize from '../icons/minimize';
import WpcomTourKitRating from './wpcom-tour-kit-rating';
import WpcomTourKitStepCardNavigation from './wpcom-tour-kit-step-card-navigation';
import type { TourStepRendererProps } from '@automattic/tour-kit';

function WpcomTourKitStepCard( {
	steps,
	currentStepIndex,
	onMinimize,
	onDismiss,
	onGoToStep,
	onNextStep,
	onPreviousStep,
	setInitialFocusedElement,
}: TourStepRendererProps ) {
	const lastStepIndex = steps.length - 1;
	const { descriptions, heading, imgSrc } = steps[ currentStepIndex ].meta;
	const isLastStep = currentStepIndex === lastStepIndex;

	const description = descriptions[ isMobile() ? 'mobile' : 'desktop' ] ?? descriptions.desktop;

	return (
		<Card className="wpcom-tour-kit-step-card" isElevated>
			<CardOverlayControls onDismiss={ onDismiss } onMinimize={ onMinimize } />
			{ /* TODO: Update selector for images in @wordpress/components/src/card/styles/card-styles.js */ }
			<CardMedia className="wpcom-tour-kit-step-card__media">
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
				<h2 className="wpcom-tour-kit-step-card__heading">{ heading }</h2>
				<p className="wpcom-tour-kit-step-card__description">
					{ description }
					{ isLastStep ? (
						<Button
							className="wpcom-tour-kit-step-card__description"
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
					<WpcomTourKitStepCardNavigation
						currentStepIndex={ currentStepIndex }
						lastStepIndex={ lastStepIndex }
						onDismiss={ onDismiss }
						onGoToStep={ onGoToStep }
						onNextStep={ onNextStep }
						onPreviousStep={ onPreviousStep }
						setInitialFocusedElement={ setInitialFocusedElement }
					></WpcomTourKitStepCardNavigation>
				) }
			</CardFooter>
		</Card>
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

export default WpcomTourKitStepCard;
