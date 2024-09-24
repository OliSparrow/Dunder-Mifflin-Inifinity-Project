import React from "react";

//Component for showing the order history of user
const orderHistory = [
    { id: 1, name: 'A4 Copy Paper 500 Sheets', price: '10$', quantity: 10 },
    { id: 2, name: 'Sticky Notes 3x3', price: '5$', quantity: 15 },
    //Just placeholder items o7
];

const OrderHistory: React.FC = () => {
    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orderHistory.map(item => (
                    <div key={item.id} className="card shadow-md bg-white text-base-content hover:bg-primary hover:text-white transition-colors h-full">
                        <div className="card-body flex flex-col justify-between h-full">
                            <div>
                                <h2 className="card-title text-xl font-bold">{item.name}</h2>
                                <p className="text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-xl font-bold">{item.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
