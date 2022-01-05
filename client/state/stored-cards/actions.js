import i18n from 'i18n-calypso';
import wp from 'calypso/lib/wp';
import {
	STORED_CARDS_ADD_COMPLETED,
	STORED_CARDS_DELETE,
	STORED_CARDS_DELETE_COMPLETED,
	STORED_CARDS_DELETE_FAILED,
	STORED_CARDS_TAX_LOCATION_UPDATE,
	STORED_CARDS_TAX_LOCATION_UPDATE_COMPLETED,
	STORED_CARDS_TAX_LOCATION_UPDATE_FAILED,
	STORED_CARDS_FETCH,
	STORED_CARDS_FETCH_COMPLETED,
	STORED_CARDS_FETCH_FAILED,
	STORED_CARDS_UPDATE_IS_BACKUP_COMPLETED,
} from 'calypso/state/action-types';

import 'calypso/state/stored-cards/init';

export const addStoredCard = ( cardData ) => ( dispatch ) => {
	return wp.req
		.post(
			{
				path: '/me/stored-cards',
			},
			{
				payment_key: cardData.token,
				use_for_existing: true,
				...( cardData.additionalData ?? {} ),
			}
		)
		.then( ( item ) => {
			dispatch( {
				type: STORED_CARDS_ADD_COMPLETED,
				item,
			} );
		} );
};

export const fetchStoredCards = () => ( dispatch ) => {
	dispatch( {
		type: STORED_CARDS_FETCH,
	} );

	return wp.req
		.get( '/me/payment-methods', { expired: 'include' } )
		.then( ( data ) => {
			dispatch( {
				type: STORED_CARDS_FETCH_COMPLETED,
				list: data,
			} );
		} )
		.catch( ( error ) => {
			dispatch( {
				type: STORED_CARDS_FETCH_FAILED,
				error: error.message || i18n.translate( 'There was a problem retrieving stored cards.' ),
			} );
		} );
};

export const deleteStoredCard = ( card ) => ( dispatch ) => {
	dispatch( {
		type: STORED_CARDS_DELETE,
		card,
	} );

	return Promise.all(
		card.allStoredDetailsIds.map( ( storedDetailsId ) =>
			wp.req.post( { path: '/me/stored-cards/' + storedDetailsId + '/delete' } )
		)
	)
		.then( () => {
			dispatch( {
				type: STORED_CARDS_DELETE_COMPLETED,
				card,
			} );
		} )
		.catch( ( error ) => {
			dispatch( {
				type: STORED_CARDS_DELETE_FAILED,
				card,
				error: error.message || i18n.translate( 'There was a problem deleting the stored card.' ),
			} );
		} );
};

export const updateStoredCardTaxLocation = ( card, tax_postal_code, tax_country_code ) => (
	dispatch
) => {
	dispatch( {
		type: STORED_CARDS_TAX_LOCATION_UPDATE,
		card,
	} );

	return Promise.all(
		card.allStoredDetailsIds.map( ( stored_details_id ) =>
			wp.req.post(
				{
					path: '/me/payment-methods/' + stored_details_id + '/edit-tax-location',
				},
				{
					tax_postal_code: tax_postal_code,
					tax_country_code: tax_country_code,
				}
			)
		)
	)
		.then( () => {
			dispatch( {
				type: STORED_CARDS_TAX_LOCATION_UPDATE_COMPLETED,
				card,
			} );
		} )
		.catch( ( error ) => {
			dispatch( {
				type: STORED_CARDS_TAX_LOCATION_UPDATE_FAILED,
				card,
				error: error.message || i18n.translate( 'There was a problem editing the stored card.' ),
			} );
		} );
};

export const updateStoredCardIsBackupComplete = ( stored_details_id, is_backup ) => {
	return {
		type: STORED_CARDS_UPDATE_IS_BACKUP_COMPLETED,
		stored_details_id,
		is_backup,
	};
};
