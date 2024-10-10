import React from 'react';
import { Order } from '../types.ts';

interface OrderTableProps {
    orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    const calculateDeliveryDate = (orderDate: string): string => {
        const orderDateObj = new Date(orderDate);
        orderDateObj.setDate(orderDateObj.getDate() + 10);
        return orderDateObj.toISOString().split('T')[0];
    };

    return (
        <div className="overflow-x-auto shadow-md">
            {Array.isArray(orders) && orders.length > 0 ? (
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Order Date</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Delivery Date</th>
                        <th>Total Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
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
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderTable;
