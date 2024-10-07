import React, { useState } from 'react';
import AdminProductList from './AdminProductList';
import AdminPropertyList from './AdminPropertyList';
import AdminOrderHistory from "./AdminOrderHistory.tsx";

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'properties' | 'orders'>('products');

    return (
        <div className="w-full p-4">
            {/* Tabs */}
            <div role="tablist" className="tabs tabs-boxed bg-white rounded-lg shadow-md">
                <a
                    className={`tab ${
                        activeTab === 'products' ? 'tab-active text-primary' : ''
                    }`}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products
                </a>
                <a
                    className={`tab ${
                        activeTab === 'properties' ? 'tab-active text-primary' : ''
                    }`}
                    onClick={() => setActiveTab('properties')}
                >
                    Manage Properties
                </a>

                <a
                    className={`tab ${
                        activeTab === 'orders' ? 'tab-active text-primary' : ''
                    }`}
                    onClick={() => setActiveTab('orders')}
                >
                    Manage Orders
                </a>
            </div>

            {/* Content */}
            <div className="mt-4">
                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-md border-base-300 p-6">
                        <AdminProductList/>
                    </div>
                )}
                {activeTab === 'properties' && (
                    <div className="bg-white rounded-lg shadow-md border-base-300 p-6">
                        <AdminPropertyList />
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-md border-base-300 p-6">
                        <AdminOrderHistory />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
