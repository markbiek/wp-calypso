import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { FunctionComponent, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import {
	isPaymentAgreement,
	getPaymentMethodSummary,
	PaymentMethod,
} from 'calypso/lib/checkout/payment-methods';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';
import { ReduxDispatch } from 'calypso/state/redux-store';
import { editStoredCardTaxLocation } from 'calypso/state/stored-cards/actions';
import { isEditingStoredCard } from 'calypso/state/stored-cards/selectors';
import PaymentMethodDetails from './payment-method-details';
import PaymentMethodEditDialog from './payment-method-edit-dialog';

interface Props {
	card: PaymentMethod;
}

const PaymentMethodEdit: FunctionComponent< Props > = ( { card } ) => {
	const translate = useTranslate();
	const isEditing = useSelector( ( state ) =>
		isEditingStoredCard( state, card.stored_details_id )
	);

	const reduxDispatch = useDispatch< ReduxDispatch >();
	const [ isDialogVisible, setIsDialogVisible ] = useState( false );
	const closeDialog = useCallback( () => setIsDialogVisible( false ), [] );

	const handleEdit = useCallback( () => {
		closeDialog();
		reduxDispatch( editStoredCardTaxLocation( card ) )
			.then( () => {
				if ( isPaymentAgreement( card ) ) {
					reduxDispatch( successNotice( translate( 'Payment method edited successfully' ) ) );
				} else {
					reduxDispatch( successNotice( translate( 'Card edited successfully!' ) ) );
				}

				recordTracksEvent( 'calypso_purchases_edit_tax_location' );
			} )
			.catch( ( error: Error ) => {
				reduxDispatch( errorNotice( error.message ) );
			} );
	}, [ closeDialog, card, translate, reduxDispatch ] );

	const renderTaxPostalCode = (): string => {
		const filtered = card.meta.find(
			( item: { meta_key: string } ) => item.meta_key === 'tax_postal_code'
		);
		return filtered?.meta_value ?? '';
	};

	const renderTaxCountryCode = (): string => {
		const filtered = card.meta.find(
			( item: { meta_key: string } ) => item.meta_key === 'tax_country_code'
		);
		return filtered?.meta_value ?? '';
	};

	const renderEditButton = () => {
		const text = isEditing ? translate( 'Editing…' ) : translate( 'Add Payment Location Info' );
		if ( ! renderTaxPostalCode() ) {
			return (
				<Button
					className="payment-method-edit__button"
					disabled={ isEditing }
					onClick={ () => setIsDialogVisible( true ) }
				>
					{ text }
				</Button>
			);
		}
	};

	return (
		<>
			<PaymentMethodEditDialog
				paymentMethodSummary={ getPaymentMethodSummary( {
					translate,
					type: card.card_type || card.payment_partner,
					digits: card.card,
					email: card.email,
				} ) }
				isVisible={ isDialogVisible }
				onClose={ closeDialog }
				onConfirm={ handleEdit }
			/>
			<PaymentMethodDetails
				lastDigits={ card.card }
				email={ card.email }
				cardType={ card.card_type || '' }
				paymentPartner={ card.payment_partner }
				name={ card.name }
				expiry={ card.expiry }
				isExpired={ card.is_expired }
				tax_postal_code={ renderTaxPostalCode() }
				tax_country_code={ renderTaxCountryCode() }
			/>
			{ renderEditButton() }
		</>
	);
};

export default PaymentMethodEdit;
