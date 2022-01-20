import WpcomTourKitStepCard from './wpcom-tour-kit-step-card';
import type { TourStepRenderer } from '@automattic/tour-kit';

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
		<WpcomTourKitStepCard
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

export default WpcomTourKitStep;
