import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '../../atoms/cartAtom';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
    // --- ATOMS ----
    const [cart, setCart] = useAtom(cartAtom);
    const navigate = useNavigate();

    // Customer state
    const [customer, setCustomer] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    // --- STATE FOR MODALS ---
    const [showOrderSuccessModal, setShowOrderSuccessModal] = useState<boolean>(false);
    const [missingField, setMissingField] = useState<string | null>(null);

    // --- HANDLERS ---
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        // Validate customer fields
        for (let key in customer) {
            if (customer[key as keyof typeof customer].trim() === '') {
                setMissingField(key);
                return;
            }
        }

        // Prepare order object using OrderDTO structure
        const order = {
            customerName: customer.name,
            customerAddress: customer.address,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            customerId: null,
            orderEntries: cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            })),
            status: "Pending",
            orderDate: new Date().toISOString(),
            totalAmount: parseFloat(
                cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)
            ),
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
                alert(`Error placing order: ${error.title || error}`);
            } else {
                setShowOrderSuccessModal(true); // Show success modal
                setCart([]);
            }

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again later.');
        }
    };

    const handleCloseMissingFieldModal = () => {
        setMissingField(null);
    };

    const handleCloseOrderSuccessModal = () => {
        setShowOrderSuccessModal(false);
        navigate('/'); // Navigate back to home after closing success modal
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
                            ).toFixed(2)}$
                        </p>
                    </div>
                </div>
            </div>

            {/* Missing Field Modal */}
            {missingField && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Missing Information</h3>
                        <p>Please fill out the "{missingField}" field to proceed with your order.</p>
                        <div className="modal-action">
                            <button className="btn" onClick={handleCloseMissingFieldModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Success Modal */}
            {showOrderSuccessModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Order Received</h3>
                        <p>Your order has been placed successfully!</p>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleCloseOrderSuccessModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
