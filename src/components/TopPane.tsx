import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import {Link} from "react-router-dom";

const TopPane: React.FC = () => {
    return (
        <div className="navbar bg-primary text-white shadow-lg p-4">
            <div className="flex-1">
                <Link to="/" className="text-xl font-bold">
                    <img
                        src="/src/assets/Dunder-Mifflin-Logo.png"
                        alt="Dunder Mifflin Logo"
                        className="h-20 w-auto"
                    />
                </Link>
            </div>

            <div className="flex-none w-full max-w-xs mx-auto">
                <input
                    type="text"
                    placeholder="Search for items"
                    className="input input-bordered w-full bg-white text-black"
                />
            </div>
            <div className="flex-none ml-4">
                <Link to="/order-history" className="btn btn-primary btn-circle">
                    <FaShoppingCart size={20}/>
                </Link>
            </div>
        </div>
    );
};


export default TopPane;
