import { Button } from '@automattic/components';
import { FormStatus, useFormStatus } from '@automattic/composite-checkout';
import { useSelect } from '@wordpress/data';
import { useTranslate } from 'i18n-calypso';
import { FunctionComponent, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import {
	isPaymentAgreement,
	getPaymentMethodSummary,
	PaymentMethod,
} from 'calypso/lib/checkout/payment-methods';
import useCountryList from 'calypso/my-sites/checkout/composite-checkout/hooks/use-country-list';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';
import { updateStoredCardTaxLocation } from 'calypso/state/stored-cards/actions';
import { isEditingStoredCard } from 'calypso/state/stored-cards/selectors';
import PaymentMethodEditDialog from './payment-method-edit-dialog';
import RenderEditFormFields from './payment-method-edit-form-fields';
import type { CountryListItem, ManagedContactDetails } from '@automattic/wpcom-checkout';
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
		console.log( inputValues );
		handleEdit();
	};

	const RenderEditForm = ( {
		section,
	}: {
		section: string;
		taxInfo: ManagedContactDetails;
		countriesList: CountryListItem[];
		isDisabled: boolean;
	} ): JSX.Element => {
		const { formStatus } = useFormStatus();
		const fields: ManagedContactDetails = useSelect( ( select ) =>
			select( 'credit-card' ).getFields()
		);

		return (
			<RenderEditFormFields
				taxInfo={ fields }
				section={ section }
				countriesList={ useCountryList( [] ) }
				isDisabled={ formStatus !== FormStatus.READY }
				card={ card }
			/>
		);
	};

	const formRender = RenderEditForm( 'section' );

	const renderEditButton = () => {
		const text = isEditing ? translate( 'Editing' ) : translate( 'Add Payment Location Info' );
		if ( ! card.tax_postal_code || ! card.tax_country_code ) {
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
				form={ formRender }
			/>
			{ renderEditButton() }
		</>
	);
};

export default PaymentMethodEdit;
