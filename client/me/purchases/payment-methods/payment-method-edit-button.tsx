import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { PaymentMethod } from 'calypso/lib/checkout/payment-methods';
import { isEditingStoredCard } from 'calypso/state/stored-cards/selectors';

interface Props {
	card: PaymentMethod;
	onClick: () => void;
}

const PaymentMethodEditButton: FunctionComponent< Props > = ( { card, onClick } ) => {
	const translate = useTranslate();
	const isEditing = useSelector( ( state ) =>
		isEditingStoredCard( state, card.stored_details_id )
	);

	const text = isEditing ? translate( 'Editing' ) : translate( 'Add Payment Location Info' );
	return (
		<Button className="payment-method-edit-button" onClick={ onClick } disabled={ isEditing }>
			{ text }
		</Button>
	);
};

export default PaymentMethodEditButton;
