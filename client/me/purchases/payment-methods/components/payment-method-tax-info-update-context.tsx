import { createContext } from 'react';

const TaxInfoUpdateContextTemplate = false;

const TaxInfoUpdateContext = createContext< boolean >( TaxInfoUpdateContextTemplate );

export default TaxInfoUpdateContext;
