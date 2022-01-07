import { createContext, useState } from 'react';

// eslint-disable-next-line react-hooks/rules-of-hooks
const [ isTaxInfoSet, setTaxInfoSet ] = useState( false );

const TaxInfoContext = createContext( { isTaxInfoSet, setTaxInfoSet } );

const TaxInfoContextProvider = ( { children } ) => {
	return (
		<TaxInfoContextProvider.Provider value={ { isTaxInfoSet, setTaxInfoSet } }>
			{ ...children }
		</TaxInfoContextProvider.Provider>
	);
};

export { TaxInfoContext, TaxInfoContextProvider };
