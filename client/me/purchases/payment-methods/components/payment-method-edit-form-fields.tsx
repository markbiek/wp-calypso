import { useTranslate } from 'i18n-calypso';
import FormTextInput from 'calypso/components/forms/form-text-input';
import useCountryList from 'calypso/my-sites/checkout/composite-checkout/hooks/use-country-list';
import TaxCountrySelectMenu from './tax-country-select-menu';

const RenderEditFormFields = ( {
	onChangePostalCode,
	onChangeCountryCode,
	postalCodeValue,
	countryCodeValue,
}: {
	value?: string;
	onChangePostalCode: unknown;
	onChangeCountryCode: unknown;
	postalCodeValue: string;
	countryCodeValue: string;
} ): JSX.Element => {
	const translate = useTranslate();
	const countriesList = useCountryList( [] );

	if ( ! postalCodeValue ) {
		postalCodeValue = '';
	}

	return (
		<>
			<TaxCountrySelectMenu
				name="tax_country_code"
				translate={ translate }
				onChange={ onChangeCountryCode }
				isError={ '' }
				isDisabled={ false }
				errorMessage={ '' }
				currentValue={ countryCodeValue || '' }
				countriesList={ countriesList }
			/>

			<FormTextInput
				name="tax_postal_code"
				placeholder="Enter postal code"
				value={ '' || postalCodeValue }
				onChange={ onChangePostalCode }
			/>
		</>
	);
};

export default RenderEditFormFields;
