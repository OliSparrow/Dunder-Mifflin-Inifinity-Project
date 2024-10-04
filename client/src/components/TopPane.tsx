import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { searchQueryAtom } from '../atoms/productAtoms';
import { useAtom } from 'jotai';
import {FaPerson, FaShield} from "react-icons/fa6";

const TopPane: React.FC = () => {
    //----ATOMS-----
    const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

    //----LOCATION-----
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    //----STYLING-----
    return (
        <div className="navbar bg-primary text-white shadow-lg p-4">
            {/* Logo */}
            <div className="flex-1">
                <Link to="/" className="text-xl font-bold">
                    <img
                        src="/src/assets/Dunder-Mifflin-Logo.png"
                        alt="Dunder Mifflin Logo"
                        className="h-20 w-auto"
                    />
                </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-none w-full max-w-xs mx-auto">
                <input
                    type="text"
                    placeholder="Search for items"
                    className="input input-bordered w-full bg-white text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Cart and Mode Toggle */}
            <div className="flex items-center ml-4 space-x-4">
                {/* Mode Toggle Button */}
                {isAdmin ? (
                    <Link to="/" className="btn btn-primary">
                        <FaPerson size={20}/> Customer
                    </Link>
                ) : (
                    <Link to="/admin" className="btn btn-primary">
                        <FaShield size={20} /> Admin
                    </Link>
                )}
               
                {/* Cart Button */}
                <Link to="/order-history" className="btn btn-primary btn-circle">
                    <FaShoppingCart size={20} />
                </Link>
            </div>
        </div>
    );
};

export default TopPane;
