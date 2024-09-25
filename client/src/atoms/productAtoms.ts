import { atom } from 'jotai';

//Atom for managing the current page in the product list
export const currentPageAtom = atom(1);

//Atom for managing the selected sort option
export const sortOptionAtom = atom('');

//Atom for managing the selected filter option
export const filterOptionAtom = atom('');

//Atom to hold the product list
export const productsAtom = atom([
    { id: 1, name: 'A4 Copy Paper 500 Sheets', price: 10, storage: 'In Stock' },
    { id: 2, name: 'Sticky Notes 3x3', price: 5, storage: 'In Stock' },
    { id: 3, name: 'Legal Pad Yellow 50 Sheets', price: 4, storage: 'Out of Stock' },
    { id: 4, name: 'Printer Paper A3 250 Sheets', price: 15, storage: 'In Stock' },
    { id: 5, name: 'Cardstock 100 Sheets', price: 12, storage: 'In Stock' },
    { id: 6, name: 'Envelopes Letter Size 100 Pack', price: 8, storage: 'Low Stock' },
    { id: 7, name: 'Notebook College Ruled 100 Pages', price: 7, storage: 'In Stock' },
    { id: 8, name: 'Postcards 50 Sheets', price: 6, storage: 'Out of Stock' },
    { id: 9, name: 'Presentation Paper Glossy 100 Sheets', price: 20, storage: 'In Stock' },
    { id: 10, name: 'Index Cards 3x5 100 Pack', price: 3, storage: 'In Stock' },
    { id: 11, name: 'Graph Paper A4 100 Sheets', price: 8, storage: 'In Stock' },
    { id: 12, name: 'Sketch Pad 50 Sheets', price: 10, storage: 'In Stock' },
    { id: 13, name: 'Poster Board White 10 Pack', price: 12, storage: 'Low Stock' },
    { id: 14, name: 'Business Cards Blank 250 Sheets', price: 18, storage: 'In Stock' },
    { id: 15, name: 'Presentation Folders 10 Pack', price: 5, storage: 'In Stock' },
    { id: 16, name: 'Recycled Copy Paper 500 Sheets', price: 11, storage: 'In Stock' },
    { id: 17, name: 'Gift Wrapping Paper 5 Rolls', price: 14, storage: 'Out of Stock' },
    { id: 18, name: 'Lined Paper Loose-Leaf 200 Sheets', price: 7, storage: 'In Stock' },
    { id: 19, name: 'Receipt Paper Roll 10 Pack', price: 9, storage: 'In Stock' },
    { id: 20, name: 'Photo Paper Glossy 50 Sheets', price: 16, storage: 'In Stock' },
    { id: 21, name: 'Binder Dividers with Tabs 8 Pack', price: 3, storage: 'In Stock' },
    { id: 22, name: 'Construction Paper Multicolor 100 Sheets', price: 8, storage: 'Low Stock' },
    { id: 23, name: 'Notebook Wide Ruled 120 Pages', price: 6, storage: 'Out of Stock' },
    { id: 24, name: 'Carbon Paper Black 100 Sheets', price: 20, storage: 'In Stock' },
    { id: 25, name: 'Desk Calendar Pad 12 Months', price: 10, storage: 'In Stock' }
    //Placeholder objects until actual DB logic has been applied
]);

//Atom for managing search queries
export const searchQueryAtom = atom('');