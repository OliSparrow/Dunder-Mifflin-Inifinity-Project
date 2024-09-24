import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const TopPane: React.FC = () => {
    return (
        <div className="flow-root p-4 bg-gray-100">
            <h1 className="float-left text-2xl font-bold">Dunder Mifflin</h1>
            <button className="float-right btn btn-primary flex items-center">
                <FaShoppingCart className="mr-2" />
            </button>
        </div>
    );
}

export default TopPane;
