import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '../../atoms/cartAtom';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
    //--- ATOMS ----
    const [cart] = useAtom(cartAtom); 
    
    // ---- USE STATES ----
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    // --- HANDLERS ----
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {
        // Placeholder: Process the order
        alert('Order placed successfully!');
        navigate('/');
    };

    // ---- STYLING ----
    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>

            {/* Grid Layout for the form and the cart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side: Customer Details Form */}
                <div>
                    <form>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleCustomerChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={customer.address}
                                onChange={handleCustomerChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={customer.phone}
                                onChange={handleCustomerChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={customer.email}
                                onChange={handleCustomerChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            className="btn btn-primary w-full"
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                {/* Right Side: Cart Summary */}
                <div className="border-l border-gray-300 pl-6">
                    <h2 className="text-xl font-bold mb-4">Items in Cart</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex justify-between">
                                    <div>
                                        <h3 className="font-bold">{item.product.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold">{item.product.price}$</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg">Total:</h3>
                        <p className="text-xl">
                            {cart.reduce(
                                (total, item) => total + item.product.price * item.quantity,
                                0
                            )}$
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
