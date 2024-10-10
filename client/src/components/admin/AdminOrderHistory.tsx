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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // --- USE EFFECT TO FETCH ORDERS ---
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<Order[]>('http://localhost:5000/api/order');

                console.log("Fetched Orders: ", response.data); 

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

    // --- HANDLERS ---
    const handleEditOrderClick = (order: Order) => {
        setEditingOrder(order);
        setShowEditModal(true);
    };

    const handleDeleteOrder = (order: Order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/order/${orderToDelete.id}`);
            setOrders(orders.filter((order) => order.id !== orderToDelete.id));
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete the order");
        } finally {
            setShowDeleteModal(false);
            setOrderToDelete(null);
        }
    };

    const handleDeleteSelectedOrders = async () => {
        try {
            await Promise.all(
                selectedOrders.map((id) => axios.delete(`http://localhost:5000/api/order/${id}`))
            );
            setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
            setSelectedOrders([]);
            setDeleteMode(false);
        } catch (error) {
            console.error("Error deleting orders:", error);
            alert("Failed to delete selected orders");
        } finally {
            setShowDeleteMultipleModal(false);
        }
    };

    const handleDeleteButtonClick = () => {
        if (deleteMode) {
            if (selectedOrders.length > 0) {
                setShowDeleteMultipleModal(true);
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

    const handleSelectOrder = (id: number) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((orderId) => orderId !== id)
                : [...prevSelected, id]
        );
    };

    const handleUpdateOrder = async () => {
        if (!editingOrder) return;

        try {
            await axios.put(`http://localhost:5000/api/order/${editingOrder.id}`, editingOrder);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === editingOrder.id ? { ...order, ...editingOrder } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status");
        } finally {
            setShowEditModal(false);
            setEditingOrder(null);
        }
    };

    const calculateDeliveryDate = (orderDate: string): string => {
        const orderDateObj = new Date(orderDate);
        orderDateObj.setDate(orderDateObj.getDate() + 10);
        return orderDateObj.toISOString().split('T')[0];
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
                            disabled={selectedOrders.length === 0}
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
                                <th>Order Date</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Delivery Date</th>
                                <th>Total Amount</th>
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
                                                    handleDeleteOrder(order);
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4">
                                        {new Date(order.orderDate).toISOString().split('T')[0]}
                                    </td>
                                    <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4">
                                        {order.customerName || "Unknown"} 
                                    </td>
                                    <td className="text-sm md:text-base p-2 md:p-4">
                                        {order.status}
                                    </td>
                                    <td className="text-sm md:text-base p-2 md:p-4">
                                        {calculateDeliveryDate(order.orderDate)}
                                    </td>
                                    <td className="text-sm md:text-base p-2 md:p-4">
                                        {order.totalAmount}$
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

            {/* Delete Confirmation Modal for Single Order */}
            {showDeleteModal && orderToDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Order</h3>
                        <p>Are you sure you want to delete the order for "{orderToDelete?.customerName || "Unknown"}"?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal for Multiple Orders */}
            {showDeleteMultipleModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Selected Orders</h3>
                        <p>Are you sure you want to delete the selected orders?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleDeleteSelectedOrders}>
                                Delete
                            </button>
                            <button className="btn" onClick={() => setShowDeleteMultipleModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {showEditModal && editingOrder && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Edit Order</h3>
                        <form>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Order Status</span>
                                </label>
                                <select
                                    value={editingOrder.status}
                                    onChange={(e) =>
                                        setEditingOrder({ ...editingOrder, status: e.target.value })
                                    }
                                    className="select select-bordered"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Not Delivered">Not Delivered</option>
                                </select>
                            </div>
                        </form>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleUpdateOrder}>
                                Save Changes
                            </button>
                            <button className="btn" onClick={() => setShowEditModal(false)}>
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