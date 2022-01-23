import classnames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import { isEmpty, omit } from 'lodash';
import FormSelect from 'calypso/components/forms/form-select';

import './style.scss';

function FormCountrySelect( { countriesList, className, onChange, disabled } ) {
	const translate = useTranslate();

	function getOptions() {
		if ( isEmpty( countriesList ) ) {
			return [
				{
					key: '',
					label: translate( 'Loading…' ),
				},
			];
		}

		return countriesList.map( ( { code, name }, idx ) => ( {
			key: idx,
			label: name,
			code,
			disabled: ! code,
		} ) );
	}

	const options = getOptions();

	return (
		<FormSelect
			{ ...omit( { countriesList, className, onChange, disabled }, [
				'className',
				'countriesList',
				'translate',
				'moment',
				'numberFormat',
			] ) }
			className={ classnames( className, 'form-country-select' ) }
			onChange={ onChange }
			disabled={ disabled }
		>
			{ options.map( function ( option ) {
				return (
					<option key={ option.key } value={ option.code } disabled={ option.disabled }>
						{ option.label }
					</option>
				);
			} ) }
		</FormSelect>
	);
}

export default FormCountrySelect;
