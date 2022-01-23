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
import { CalypsoDispatch } from 'calypso/state/types';
import PaymentMethodEditButton from './components/payment-method-edit-button';
import PaymentMethodEditDialog from './components/payment-method-edit-dialog';
import RenderEditFormFields from './components/payment-method-edit-form-fields';

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

	const [ inputValues, setInputValues ] = useState( {
		tax_postal_code: card.tax_postal_code,
		tax_country_code: card.tax_postal_code,
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

	const handleSubmit = ( event: React.SyntheticEvent ) => {
		event.preventDefault();
		const { id, value } = event.target as HTMLInputElement;
		setInputValues( { ...inputValues, [ id ]: value } );
		handleEdit();
	};

	const onChangeCountryCode = ( e: { target: { value: string } } ) => {
		setInputValues( { ...inputValues, tax_country_code: e.target.value } );
	};

	const onChangePostalCode = ( e: { target: { value: string } } ) => {
		setInputValues( { ...inputValues, tax_postal_code: e.target.value } );
	};

	const postalCodeValue = inputValues.tax_postal_code;
	const countryCodeValue = inputValues.tax_country_code;

	const renderEditForm = (): JSX.Element => {
		return (
			<form onSubmit={ handleSubmit }>
				<div className="contact-fields payment-method-edit__tax-fields">
					<RenderEditFormFields
						postalCodeValue={ postalCodeValue }
						countryCodeValue={ countryCodeValue }
						onChangePostalCode={ onChangePostalCode }
						onChangeCountryCode={ onChangeCountryCode }
					/>
				</div>
			</form>
		);
	};

	const formRender = renderEditForm();
	const showButton = ! card.tax_postal_code || ! card.tax_country_code;

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
				form={ formRender }
			/>
			<PaymentMethodEditButton
				onClick={ () => setIsDialogVisible( true ) }
				isEditing={ isEditing }
				show={ showButton }
			/>
		</>
	);
};

export default PaymentMethodEdit;
