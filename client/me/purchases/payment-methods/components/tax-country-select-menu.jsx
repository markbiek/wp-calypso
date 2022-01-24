import FormCountrySelect from 'calypso/components/forms/form-country-select';
import FormFieldAnnotation from 'calypso/my-sites/checkout/composite-checkout/components/form-field-annotation';

export default function TaxCountrySelectMenu( {
	translate,
	onChange,
	isDisabled,
	isError,
	errorMessage,
	currentValue,
	countriesList,
	name,
} ) {
	const countrySelectorId = 'country-selector';
	const countrySelectorLabelId = 'country-selector-label';
	const countrySelectorDescriptionId = 'country-selector-description';

	return (
		<FormFieldAnnotation
			labelText={ translate( 'Country' ) }
			isError={ isError }
			isDisabled={ isDisabled }
			formFieldId={ countrySelectorId }
			labelId={ countrySelectorLabelId }
			descriptionId={ countrySelectorDescriptionId }
			errorDescription={ errorMessage }
		>
			<FormCountrySelect
				countriesList={ [
					{ code: '', name: translate( 'Select Country' ) },
					{ code: null, name: '' },
					...countriesList,
				] }
				name={ name }
				onChange={ onChange }
				disabled={ isDisabled }
				value={ currentValue }
			/>
		</FormFieldAnnotation>
	);
}
