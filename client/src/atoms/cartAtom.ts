import { atom } from 'jotai';
import { Product } from './productAtoms';

export interface CartItem {
    product: Product;
    quantity: number;
}

//Atom storing the state of the cart
export const cartAtom = atom<CartItem[]>([]);
