import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

//Placeholder interface
interface Order {
    id: number;
    customerName: string;
    totalAmount: number;
    status: string;
}

//Placeholder orders
const placeholderOrders: Order[] = [
    { id: 1, customerName: 'John Doe', totalAmount: 150, status: 'Pending' },
    { id: 2, customerName: 'Jane Smith', totalAmount: 200, status: 'Shipped' },
    { id: 3, customerName: 'Mike Johnson', totalAmount: 80, status: 'Delivered' },
];

const AdminOrderHistory: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);

    // --- USE EFFECT ---
    useEffect(() => {
        //Simulate fetching orders from backend
        setOrders(placeholderOrders);
    }, []);

    // --- HANDLERS ---
    const handleEditOrderClick = (order: Order) => {
        setEditingOrder(order);
    };

    const handleDeleteOrder = (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this order?');
        if (confirmed) {
            setOrders(orders.filter((order) => order.id !== id));
        }
    };

    const handleSelectOrder = (id: number) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((orderId) => orderId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelectedOrders = () => {
        const confirmed = window.confirm('Are you sure you want to delete the selected orders?');
        if (confirmed) {
            setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
            setSelectedOrders([]);
            setDeleteMode(false);
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

    const handleUpdateOrder = (updatedOrder: Partial<Order> & { id: number }) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
            )
        );
    };

    // --- STYLING & RENDERING ---
    return (
        <div className="w-full p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4">
                {/* Left Side Buttons */}
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
                            <td className="text-sm md:text-base p-2 md:p-4">{order.status}</td>
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
