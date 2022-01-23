import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { FunctionComponent } from 'react';

interface Props {
	onClick: () => void;
	isEditing: boolean;
	show: boolean;
}

const PaymentMethodEditButton: FunctionComponent< Props > = ( { onClick, isEditing, show } ) => {
	const translate = useTranslate();
	const buttonText = isEditing ? translate( 'Editing' ) : translate( 'Update Payment Info' );

	if ( show ) {
		return (
			<Button className="payment-method-edit-button" onClick={ onClick } disabled={ isEditing }>
				{ buttonText }
			</Button>
		);
	}
	return null;
};

export default PaymentMethodEditButton;
