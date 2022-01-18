// import { TourKitContextProvider } from './tour-kit-context';
import TourKitPortal from './tour-kit-portal';
import type { Config } from '../types';

import '../styles.scss';

interface Props {
	config: Config;
}

const TourKit: React.FunctionComponent< Props > = ( { config } ) => {
	if ( config === undefined ) {
		throw new Error( 'no config no cream' );
	}

	return <TourKitPortal config={ config } />;

	// return (
	// 	<TourKitContextProvider config={ config }>
	// 		<TourKitPortal />
	// 	</TourKitContextProvider>
	// );
};

export default TourKit;
