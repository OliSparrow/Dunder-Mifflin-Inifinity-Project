import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '../../atoms/cartAtom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Order } from '../types.ts';
import OrderTable from './OrderTable';

const Cart: React.FC = () => {
    // --- ATOMS ---
    const [cart, setCart] = useAtom(cartAtom);

    // --- STATE FOR ORDERS ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- STATE FOR EMPTY CART MODAL ---
    const [showEmptyCartModal, setShowEmptyCartModal] = useState<boolean>(false);

    // --- OTHER ---
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<Order[]>('http://localhost:5000/api/order');
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    throw new Error('Response is not an array');
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.product.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        setCart(
            cart.map(item =>
                item.product.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
            )
        );
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            setShowEmptyCartModal(true);
            return;
        }
        navigate('/checkout');
    };

    const handleCloseEmptyCartModal = () => {
        setShowEmptyCartModal(false);
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

            <div className="divider" />

            {/* Orders Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Order History</h2>
                {loading ? (
                    <p>Loading orders...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <OrderTable orders={orders} />
                )}
            </div>

            {/* Empty Cart Modal */}
            {showEmptyCartModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Cart is Empty</h3>
                        <p>Add some products before proceeding to checkout.</p>
                        <div className="modal-action">
                            <button className="btn" onClick={handleCloseEmptyCartModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
