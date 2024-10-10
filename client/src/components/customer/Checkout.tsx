import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '../../atoms/cartAtom';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
    //--- ATOMS ----
    const [cart, setCart] = useAtom(cartAtom);
    const navigate = useNavigate();

    // Customer state
    const [customer, setCustomer] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    // --- HANDLERS ---
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        console.log("Cart before placing the order: ", cart);

        const order = {
            customer: customer,
            orderEntries: cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
            })),
            status: "Pending",
            orderDate: new Date().toISOString(),
            totalAmount: cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
        };

        console.log("Order being sent: ", order);

        try {
            const response = await fetch('http://localhost:5000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Order error:', error);
                alert(`Error placing order: ${error.title}`);
            } else {
                alert('Order placed successfully!');
                setCart([]);
                navigate('/');
            }

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again later.');
        }
    };


    // ---- STYLING ----
    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Details Form */}
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

                {/* Cart Summary */}
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
