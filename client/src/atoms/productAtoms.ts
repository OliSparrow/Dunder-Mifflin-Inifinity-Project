import { atom } from 'jotai';

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;  
    discontinued: boolean;
    paperProperties: PaperProperty[];
}

export interface PaperProperty {
    paperId: number;
    propertyId: number;
    property: Property;
}

export interface Property {
    id: number;
    propertyName: string;
    paperProperties: PaperProperty[];
}

//Atom for holding the property list
export const propertiesAtom = atom<Property[]>([]);

//Atom for managing the current page in the product list
export const currentPageAtom = atom(1);

//Atom for managing the selected sort option
export const sortOptionAtom = atom('');

//Atom for managing the selected filter option
export const filterOptionAtom = atom('');

//Atom to hold the product list
export const productsAtom = atom<Product[]>([]);

//Atom for managing search queries
export const searchQueryAtom = atom('');

//Atom to track toggle state
export const showDiscontinuedAtom = atom(false);