import { atom } from 'jotai';
import {CartItem} from "../components/types.ts";

//Atom storing the state of the cart
export const cartAtom = atom<CartItem[]>([]);
