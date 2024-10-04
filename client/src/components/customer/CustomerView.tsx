import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SortFilterPanel from './SortFilterPanel';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';

const CustomerView: React.FC = () => {
    return (
        <div className="p-4 bg-base-100 min-h-screen flex">
            <div className="w-1/5">
                <SortFilterPanel />
            </div>

            <div className="divider divider-horizontal"></div>

            <div className="w-3/4 p-4">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </div>
        </div>
    );
};

export default CustomerView;
