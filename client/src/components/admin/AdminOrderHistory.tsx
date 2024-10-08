import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { Order } from '../types.ts';

const AdminOrderHistory: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);

    // --- USE EFFECT TO FETCH ORDERS ---
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<Order[]>('http://localhost:5000/api/order');

                // Validate if response is an array
                if (Array.isArray(response.data)) {
                    setOrders(response.data); // Set orders from API
                } else {
                    throw new Error('Response is not an array');
                }
                setLoading(false); // Stop loading when data is received
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders");
                setLoading(false);
            }
        };

        fetchOrders(); // Fetch orders on component mount
    }, []);

    // --- HANDLERS ---
    const handleEditOrderClick = (order: Order) => {
        setEditingOrder(order);
    };

    const handleDeleteOrder = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this order?');
        if (confirmed) {
            setDeleting(true); // Indicate deletion is in progress
            try {
                await axios.delete(`http://localhost:5000/api/order/${id}`);
                setOrders(orders.filter((order) => order.id !== id)); // Update state after deletion
                alert('Order deleted successfully'); // Success feedback
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete the order");
            } finally {
                setDeleting(false); // Reset deleting state
            }
        }
    };

    const handleSelectOrder = (id: number) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((orderId) => orderId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelectedOrders = async () => {
        const confirmed = window.confirm('Are you sure you want to delete the selected orders?');
        if (confirmed) {
            setDeleting(true); // Indicate deletion is in progress
            try {
                await Promise.all(
                    selectedOrders.map((id) => axios.delete(`http://localhost:5000/api/order/${id}`))
                );
                setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
                setSelectedOrders([]);
                setDeleteMode(false);
                alert('Selected orders deleted successfully');
            } catch (error) {
                console.error("Error deleting orders:", error);
                alert("Failed to delete selected orders");
            } finally {
                setDeleting(false); // Reset deleting state
            }
        }
    };

    const handleDeleteButtonClick = () => {
        if (deleteMode) {
            if (selectedOrders.length > 0) {
                handleDeleteSelectedOrders();
            } else {
                setDeleteMode(false);
                setSelectedOrders([]);
            }
        } else {
            setDeleteMode(true);
        }
    };

    const handleClearSelections = () => {
        setSelectedOrders([]);
    };

    const handleUpdateOrder = async (updatedOrder: Partial<Order> & { id: number }) => {
        try {
            await axios.put(`http://localhost:5000/api/order/${updatedOrder.id}`, updatedOrder);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
                )
            );
            setEditingOrder(null); // Close the modal after updating
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Failed to update order");
        }
    };

    // --- STYLING & RENDERING ---
    return (
        <div className="w-full p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button
                        className={`btn ${deleteMode ? 'btn-error' : 'btn-error'}`}
                        onClick={handleDeleteButtonClick}
                        disabled={!deleteMode || selectedOrders.length === 0 || deleting} // Disable if no orders selected or during deletion
                    >
                        {deleteMode
                            ? selectedOrders.length > 0
                                ? `Delete Selected (${selectedOrders.length})`
                                : 'Exit Delete Mode'
                            : 'Delete Multiple'}
                    </button>

                    {deleteMode && (
                        <button
                            className="btn btn-outline"
                            disabled={selectedOrders.length === 0 || deleting} // Disable if no selections or during deletion
                            onClick={handleClearSelections}
                        >
                            {selectedOrders.length > 0
                                ? `Clear Selections (${selectedOrders.length})`
                                : 'Clear Selections'}
                        </button>
                    )}
                </div>
            </div>

            {/* Order Table */}
            <div className="overflow-x-auto shadow-md">
                {loading ? (
                    <p>Loading orders...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    Array.isArray(orders) && orders.length > 0 ? (
                        <table className="table table-zebra w-full">
                            <thead>
                            <tr>
                                <th>{deleteMode ? 'Select' : 'Delete'}</th>
                                <th>Customer Name</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className={`${
                                        deleteMode && selectedOrders.includes(order.id)
                                            ? 'bg-red-200'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        if (deleteMode) {
                                            handleSelectOrder(order.id);
                                        }
                                    }}
                                >
                                    <td>
                                        {deleteMode ? (
                                            selectedOrders.includes(order.id) ? (
                                                <FaCheck className="text-green-600" />
                                            ) : (
                                                <span></span>
                                            )
                                        ) : (
                                            <FaTrash
                                                className="cursor-pointer text-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteOrder(order.id);
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4">
                                        {order.customerName}
                                    </td>
                                    <td className="text-sm md:text-base p-2 md:p-4">
                                        {order.totalAmount}$
                                    </td>
                                    <td className="text-sm md:text-base p-2 md:p-4">
                                        {order.status}
                                    </td>
                                    <td className="p-2 md:p-4">
                                        <FaEdit
                                            className="cursor-pointer text-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditOrderClick(order);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No orders found.</p>
                    )
                )}
            </div>

            {/* Placeholder for Editing Modal */}
            {editingOrder && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Edit Order</h3>
                        <form>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Customer Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={editingOrder.customerName}
                                    className="input input-bordered"
                                    readOnly
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Total Amount</span>
                                </label>
                                <input
                                    type="number"
                                    value={editingOrder.totalAmount}
                                    className="input input-bordered"
                                    readOnly
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Status</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={editingOrder.status}
                                    onChange={(e) =>
                                        handleUpdateOrder({
                                            id: editingOrder.id,
                                            status: e.target.value
                                        })
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </form>
                        <div className="modal-action">
                            <button
                                className="btn btn-outline"
                                onClick={() => setEditingOrder(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderHistory;