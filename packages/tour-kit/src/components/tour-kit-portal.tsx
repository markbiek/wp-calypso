/**
 * External Dependencies
 */
import { createPortal, useEffect, useRef } from '@wordpress/element';
/**
 * Internal Dependencies
 */
import TourKitFrame from './tour-kit-frame';

const TourKitPortal: React.FunctionComponent = () => {
	const portalParent = useRef( document.createElement( 'div' ) ).current;

	useEffect( () => {
		// @todo clk "tour-kit"
		portalParent.classList.add( 'tour-kit-portal' );
		document.body.appendChild( portalParent );

		return () => {
			document.body.removeChild( portalParent );
		};
	}, [ portalParent ] );

	return <div>{ createPortal( <TourKitFrame />, portalParent ) }</div>;
};

export default TourKitPortal;
