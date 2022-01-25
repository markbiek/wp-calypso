/**
 * External Dependencies
 */
import type { WpcomStep } from '../../../types';

export function usePrefetchTourAssets( steps: WpcomStep[] ): void {
	steps.forEach( ( step ) => {
		step.meta.imgSrc?.mobile && ( new window.Image().src = step.meta.imgSrc.mobile.src );
		step.meta.imgSrc?.desktop && ( new window.Image().src = step.meta.imgSrc.desktop.src );
	} );
}
