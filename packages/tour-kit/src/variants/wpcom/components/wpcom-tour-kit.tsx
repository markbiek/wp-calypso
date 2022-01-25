import TourKit from '../../../components/tour-kit';
import WpcomTourKitMinimized from './wpcom-tour-kit-minimized';
import WpcomTourKitStep from './wpcom-tour-kit-step';
import '../styles.scss';
import type { WpcomConfig, TourStepRenderer } from '../../../types';

interface Props {
	config: WpcomConfig;
}

const WpcomTourKit: React.FunctionComponent< Props > = ( { config } ) => {
	if ( config === undefined ) {
		throw new Error( 'no config no cream' );
	}

	return (
		<TourKit
			config={ {
				...config,
				renderers: {
					tourStep: WpcomTourKitStep as TourStepRenderer,
					tourMinimized: WpcomTourKitMinimized,
				},
			} }
		/>
	);
};

export default WpcomTourKit;
