import { Field } from '@automattic/wpcom-checkout';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import { PaymentMethod } from 'calypso/lib/checkout/payment-methods';
import CountrySelectMenu from 'calypso/my-sites/checkout/composite-checkout/components/country-select-menu';
import { isValid } from 'calypso/my-sites/checkout/composite-checkout/types/wpcom-store-state';
import type { CountryListItem, ManagedContactDetails } from '@automattic/wpcom-checkout';

const RenderEditFormFields = ( {
	taxInfo,
	countriesList,
	isDisabled,
	card,
}: {
	section: string;
	taxInfo: ManagedContactDetails;
	countriesList: CountryListItem[];
	isDisabled: boolean;
	card: PaymentMethod;
} ) => {
	const translate = useTranslate();
	const { postalCode, countryCode } = taxInfo;

	const [ inputValues, setInputValues ] = useState( {
		tax_postal_code: card.tax_postal_code,
		tax_country_code: card.tax_postal_code,
	} );

	return (
		<>
			<CountrySelectMenu
				translate={ false }
				onChange={ ( e: React.ChangeEvent< HTMLInputElement > ): void =>
					setInputValues( {
						...inputValues,
						tax_country_code: e.target.value,
					} )
				}
				isError={ countryCode?.isTouched && ! isValid( countryCode ) }
				isDisabled={ isDisabled }
				errorMessage={ countryCode?.errors[ 0 ] ?? translate( 'The country is required.' ) }
				currentValue={ countryCode?.value }
				countriesList={ countriesList }
			/>
			<Field
				id="tax_postal_code"
				type="text"
				label={ String( translate( 'Postal code' ) ) }
				value={ postalCode?.value ?? '' }
				disabled={ isDisabled }
				onChange={ ( e: React.ChangeEvent< HTMLInputElement > ): void =>
					setInputValues( {
						...inputValues,
						tax_postal_code: e.target.value,
					} )
				}
				isError={ postalCode?.isTouched && ! isValid( postalCode ) }
				errorMessage={
					postalCode?.errors[ 0 ] ?? String( translate( 'The postal code is required.' ) )
				}
			/>
		</>
	);
};

export default RenderEditFormFields;
