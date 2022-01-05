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
import { updateStoredCardTaxLocation } from 'calypso/state/stored-cards/actions';
import { isEditingStoredCard } from 'calypso/state/stored-cards/selectors';
import PaymentMethodDetails from './payment-method-details';
import PaymentMethodEditDialog from './payment-method-edit-dialog';
import type { CalypsoDispatch } from 'calypso/state/types';

interface Props {
	card: PaymentMethod;
}

const PaymentMethodEdit: FunctionComponent< Props > = ( { card } ) => {
	const translate = useTranslate();
	const isEditing = useSelector( ( state ) =>
		isEditingStoredCard( state, card.stored_details_id )
	);

	const reduxDispatch = useDispatch< CalypsoDispatch >();
	const [ isDialogVisible, setIsDialogVisible ] = useState( false );
	const closeDialog = useCallback( () => setIsDialogVisible( false ), [] );

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

	const [ inputValues, setInputValues ] = useState( {
		tax_postal_code: '',
		tax_country_code: '',
	} );

	const handleEdit = useCallback( () => {
		closeDialog();

		reduxDispatch(
			updateStoredCardTaxLocation( card, inputValues.tax_postal_code, inputValues.tax_country_code )
		)
			.then( () => {
				if ( isPaymentAgreement( card ) ) {
					reduxDispatch( successNotice( translate( 'Payment method edited successfully' ) ) );
				} else {
					reduxDispatch( successNotice( translate( 'Card edited successfully!' ) ) );
				}
				recordTracksEvent( 'calypso_purchases_edit_tax_location' );
			} )
			.then( () => {
				window.location.reload();
			} )
			.catch( ( error: Error ) => {
				reduxDispatch( errorNotice( error.message ) );
			} );
	}, [
		closeDialog,
		card,
		inputValues.tax_postal_code,
		inputValues.tax_country_code,
		translate,
		reduxDispatch,
	] );

	const handleSubmit = ( event ) => {
		event.preventDefault();
		const { name, value } = event.target;
		setInputValues( { ...inputValues, [ name ]: value } );
		handleEdit();
	};

	const renderEditForm = () => {
		return (
			<form onSubmit={ handleSubmit }>
				<input
					type="text"
					name="tax_postal_code"
					placeholder="Enter postal code"
					value={ inputValues.tax_postal_code }
					onChange={ ( e ) =>
						setInputValues( { ...inputValues, tax_postal_code: e.target.value } )
					}
				/>
				<input
					type="text"
					name="tax_country_code"
					placeholder="Enter country code"
					value={ inputValues.tax_country_code }
					onChange={ ( e ) =>
						setInputValues( { ...inputValues, tax_country_code: e.target.value } )
					}
				/>
			</form>
		);
	};

	const renderEditButton = () => {
		const text = isEditing ? translate( 'Editing' ) : translate( 'Add Payment Location Info' );
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
				onConfirm={ handleSubmit }
				card={ card }
				form={ renderEditForm() }
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
