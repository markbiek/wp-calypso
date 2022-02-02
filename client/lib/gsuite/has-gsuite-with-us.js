import { getGSuiteSubscriptionStatus } from 'calypso/lib/gsuite/get-gsuite-subscription-status';

/**
 * Given a domain object, does that domain have G Suite with us.
 *
 * @param {import('../domains/types').ResponseDomain | import('calypso/state/sites/domains/types').SiteDomain | undefined } domain - Domain object
 * @returns {boolean} - true if the domain is under our management, false otherwise
 */
export function hasGSuiteWithUs( domain ) {
	const status = getGSuiteSubscriptionStatus( domain );

	return ! [ '', 'no_subscription', 'other_provider' ].includes( status );
}
