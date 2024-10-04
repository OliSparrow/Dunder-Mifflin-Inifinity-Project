// src/components/admin/AdminDashboard.tsx
import React, { useState } from 'react';
import AdminProductList from './AdminProductList';
import AdminPropertyList from './AdminPropertyList';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'properties'>('products');

    return (
        <div className="w-full p-4 ">
            {/* Tabs */}
            <div role="tablist" className="tabs tabs-boxed bg-white rounded-lg shadow-md">
                <a
                    className={`tab tab-lifted ${
                        activeTab === 'products' ? 'tab-active text-primary ' : ''
                    }`}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products
                </a>
                <a
                    className={`tab tab-lifted ${
                        activeTab === 'properties' ? 'tab-active text-primary' : ''
                    }`}
                    onClick={() => setActiveTab('properties')}
                >
                    Manage Properties
                </a>
            </div>

            {/* Content */}
            <div className="mt-4">
                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-md border-base-300 rounded-box p-6">
                        <AdminProductList />
                    </div>
                )}
                {activeTab === 'properties' && (
                    <div className="bg-white rounded-lg shadow-md border-base-300 p-6">
                        <AdminPropertyList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
