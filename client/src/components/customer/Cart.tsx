import React from "react";
import { useAtom } from "jotai";
import { cartAtom } from "../../atoms/cartAtom";
import {useNavigate} from "react-router-dom";


const Cart: React.FC = () => {
    // --- ATOMS ---
    const [cart, setCart] = useAtom(cartAtom);

    // --- OTHER ---
    const navigate = useNavigate();
    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.product.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        console.log(`Updating product ID ${id} to quantity ${quantity}`);

        setCart(
            cart.map(item =>
                item.product.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
            )
        );
    };

    // ---- HANDLERS ----
    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Add some products before proceeding to checkout.');
            return;
        }
        navigate('/checkout');
    };


    // --- STYLING ---
    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">In Cart</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="card shadow-md bg-white text-base-content hover:bg-primary hover:text-white transition-colors h-full">
                            <div className="card-body flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="card-title text-xl font-bold">{item.product.name}</h2>
                                    <p className="text-sm">Quantity:
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                                            className="input input-bordered w-16 ml-2"
                                        />
                                    </p>
                                </div>
                                <div className="text-xl font-bold">{item.product.price}$</div>
                                <button className="btn btn-error mt-2" onClick={() => removeFromCart(item.product.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4">
                <button onClick={handleCheckout} className="btn btn-primary">
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
