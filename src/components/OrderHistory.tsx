import React from "react";

//Component for showing the order history of user
const OrderHistory: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Your Order History</h1>
            {/*Placeholder until DB logic is applied*/}
            <ul className="list-disc ml-6">
                <li>Order #1: Details of the order</li>
                <li>Order #2: Details of the order</li>
            </ul>
        </div>
    );
};

export default OrderHistory;
