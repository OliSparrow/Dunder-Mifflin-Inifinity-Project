import React from "react";

//Component for showing the order history of user
const orderHistory = [
    { id: 1, name: 'Canon Pixma Printer', price: '40$', quantity: 1 },
    { id: 2, name: 'HP Envy Printer', price: '100$', quantity: 2 },
    //Just placeholder items o7
];

const OrderHistory: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>
            <div className="grid grid-cols-1 gap-4">
                {orderHistory.map(item => (
                    <div key={item.id} className="card shadow-md compact bg-base-100">
                        <div className="card-body">
                            <h2 className="card-title">{item.name}</h2>
                            <p className="text-sm">Quantity: {item.quantity}</p>
                            <div className="text-xl font-bold">{item.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
