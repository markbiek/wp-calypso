/**
 * External Dependencies
 */
import classnames from 'classnames';
/**
 * Internal Dependencies
 */
import { classParser } from '../utils';
import type { Config, TourStepRendererProps } from '../types';

interface Props extends TourStepRendererProps {
	config: Config;
}

const TourKitStep: React.FunctionComponent< Props > = ( {
	config,
	steps,
	currentStepIndex,
	onMinimize,
	onDismiss,
	onNextStep,
	onPreviousStep,
	setInitialFocusedElement,
	onGoToStep,
} ) => {
	const classes = classnames(
		'tour-kit-step',
		`is-step-${ currentStepIndex }`,
		classParser( config.steps[ currentStepIndex ].options?.classNames )
	);

	return (
		<div className={ classes }>
			{ config.renderers.tourStep( {
				steps,
				currentStepIndex,
				onDismiss,
				onNextStep,
				onPreviousStep,
				onMinimize,
				setInitialFocusedElement,
				onGoToStep,
			} ) }
		</div>
	);
};

export default TourKitStep;
