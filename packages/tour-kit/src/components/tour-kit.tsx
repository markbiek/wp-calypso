// import { TourKitContextProvider } from './tour-kit-context';
import { createPortal, useEffect, useRef } from '@wordpress/element';
import TourKitFrame from './tour-kit-frame';
import type { Config } from '../types';

import '../styles.scss';

interface Props {
	config: Config;
}

const TourKit: React.FunctionComponent< Props > = ( { config } ) => {
	if ( config === undefined ) {
		throw new Error( 'no config no cream' );
	}

	const portalParent = useRef( document.createElement( 'div' ) ).current;

	useEffect( () => {
		portalParent.classList.add( 'tour-kit' );
		document.body.appendChild( portalParent );

		return () => {
			document.body.removeChild( portalParent );
		};
	}, [ portalParent ] );

	return <div>{ createPortal( <TourKitFrame config={ config } />, portalParent ) }</div>;
};

export default TourKit;
