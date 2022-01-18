import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
// import { useTourKitContext } from '../../../components/tour-kit-context';
import thumbsDown from '../icons/thumbs_down';
import thumbsUp from '../icons/thumbs_up';
import type { WpcomConfig } from '../../../types';

interface Props {
	currentStepIndex: number;
	config: WpcomConfig;
}

const WpcomTourKitRating: React.FunctionComponent< Props > = ( { currentStepIndex, config } ) => {
	// const { config } = useTourKitContext();
	let isDisabled = false;

	// ---------------------------------
	// @TODO CLK Use context/state instead for now and rethink persistence
	// ---------------------------------
	// const tourRating = useSelect( ( select ) =>
	// 	select( 'automattic/wpcom-welcome-guide' ).getTourRating()
	// );
	// const { setTourRating } = useDispatch( 'automattic/wpcom-welcome-guide' );
	// ---------------------------------

	const [ tourRating, setTourRating ] = useState< 'thumbs-up' | 'thumbs-down' | null >( null );

	if ( ! isDisabled && tourRating ) {
		isDisabled = true;
	}
	const rateTour = ( isThumbsUp: boolean ) => {
		if ( isDisabled ) {
			return;
		}
		isDisabled = true;
		setTourRating( isThumbsUp ? 'thumbs-up' : 'thumbs-down' );
		config.options?.callbacks?.onTourRate &&
			config.options?.callbacks?.onTourRate( currentStepIndex, isThumbsUp );
	};

	return (
		<>
			<p className="wpcom-tour-kit-rating__end-text">
				{ __( 'Did you find this guide helpful?', 'full-site-editing' ) }
			</p>
			<div>
				<Button
					aria-label={ __( 'Rate thumbs up', 'full-site-editing' ) }
					className={ classNames( 'wpcom-tour-kit-rating__end-icon', {
						active: tourRating === 'thumbs-up',
					} ) }
					disabled={ isDisabled }
					icon={ thumbsUp }
					onClick={ () => rateTour( true ) }
					iconSize={ 24 }
				/>
				<Button
					aria-label={ __( 'Rate thumbs down', 'full-site-editing' ) }
					className={ classNames( 'wpcom-tour-kit-rating__end-icon', {
						active: tourRating === 'thumbs-down',
					} ) }
					disabled={ isDisabled }
					icon={ thumbsDown }
					onClick={ () => rateTour( false ) }
					iconSize={ 24 }
				/>
			</div>
		</>
	);
};

export default WpcomTourKitRating;
