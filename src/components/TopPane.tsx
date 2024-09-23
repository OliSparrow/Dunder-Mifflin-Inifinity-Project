import React from "react";
import { FaShoppingCart } from 'react-icons/fa';

const TopPane: React.FC = () => {
    return (
        <div
            className="bg-gray-800 text-white w-full p-4 flex justify-between items-center fixed top-0 left-0 shadow-md z-50">
            <div className="text-xl font-bold">Dunder Mifflin Infinity</div>
            <div className="w-1/2">
                <input
                    type="text"
                    placeholder="Search for items here"
                    className="input input-bordered w-full"
                />
            </div>
            <button className="btn btn-primary flex items-center">
                <FaShoppingCart className="mr-2"/> Cart
            </button>
        </div>
    );
};

export default TopPane;
