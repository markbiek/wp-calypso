import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { FunctionComponent } from 'react';

interface Props {
	onClick: () => void;
	isEditing: boolean;
}

const PaymentMethodEditButton: FunctionComponent< Props > = ( { onClick, isEditing } ) => {
	const translate = useTranslate();
	const editing = isEditing;
	const buttonText = editing ? translate( 'Editing' ) : translate( 'Update Payment Info' );
	return (
		<Button className="payment-method-edit-button" onClick={ onClick } disabled={ isEditing }>
			{ buttonText }
		</Button>
	);
};

export default PaymentMethodEditButton;
