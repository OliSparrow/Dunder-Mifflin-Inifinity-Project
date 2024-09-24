import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import {Link} from "react-router-dom";

const TopPane: React.FC = () => {
    return (
        <div className="navbar bg-base-200 shadow-lg p-4">
            <div className="flex-1">
                <Link to="/" className="text-xl font-bold">
                    DUNDER MIFFLIN
                </Link>
            </div>

            <div className="flex-none w-full max-w-xs">
                <input
                    type="text"
                    placeholder="Search for items"
                    className="input input-bordered w-full"
                />
            </div>
            <div className="flex-none ml-4">
                <Link to="/order-history" className="btn btn-primary">
                    <FaShoppingCart className="mr-2"/>
                </Link>
            </div>
        </div>
    );
};


export default TopPane;
