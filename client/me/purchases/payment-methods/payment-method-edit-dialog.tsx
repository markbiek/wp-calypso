import { Button, Dialog } from '@automattic/components';
import { useTranslate, TranslateResult } from 'i18n-calypso';
import { FunctionComponent } from 'react';
import CardHeading from 'calypso/components/card-heading';
import { PaymentMethod } from 'calypso/lib/checkout/payment-methods';

import 'calypso/me/purchases/payment-methods/style.scss';

interface Props {
	paymentMethodSummary: TranslateResult;
	card: PaymentMethod;
	isVisible: boolean;
	onClose: () => void;
	onConfirm: ( event: React.MouseEvent< HTMLButtonElement > ) => void;
	form: JSX.Element;
}

const PaymentMethodEditDialog: FunctionComponent< Props > = ( {
	paymentMethodSummary,
	isVisible,
	onClose,
	onConfirm,
	form,
} ) => {
	const translate = useTranslate();

	return (
		<Dialog
			isVisible={ isVisible }
			additionalClassNames="payment-method-edit-dialog"
			onClose={ onClose }
			buttons={ [
				<Button onClick={ onClose }>{ translate( 'Cancel' ) }</Button>,
				<Button onClick={ onConfirm } primary>
					{ translate( 'Save' ) }
				</Button>,
			] }
		>
			<CardHeading tagName="h2" size={ 24 }>
				{ translate( 'Update Your Payment Method' ) }
			</CardHeading>
			<p>
				{ translate( 'Please update the following information for {{paymentMethodSummary/}}:', {
					components: {
						paymentMethodSummary: <strong>{ paymentMethodSummary }</strong>,
					},
				} ) }
			</p>
			{ form }
		</Dialog>
	);
};

export default PaymentMethodEditDialog;
