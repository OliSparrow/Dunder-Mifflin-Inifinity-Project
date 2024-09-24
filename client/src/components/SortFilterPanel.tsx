import React from 'react';
import { useAtom } from 'jotai';
import { sortOptionAtom, filterOptionAtom } from '../atoms/productAtoms.ts';

interface SortFilterPanelProps {
    onAddProductClick: () => void;
    onDeleteModeToggle: () => void;
    deleteMode: boolean;
}

const SortFilterPanel: React.FC<SortFilterPanelProps> = ({ onAddProductClick, onDeleteModeToggle, deleteMode }) => {
    const [sortOption, setSortOption] = useAtom(sortOptionAtom);
    const [filterOption, setFilterOption] = useAtom(filterOptionAtom);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOption(e.target.value);
    };

    return (
        <div className="w-1/5 p-4">
            <div className="mb-4">
                <label className="block mb-2 font-bold">Sort by Price</label>
                <select onChange={handleSortChange} value={sortOption} className="select select-bordered bg-white w-full">
                    <option value="">Select...</option>
                    <option value="price-low-high">Lowest to Highest</option>
                    <option value="price-high-low">Highest to Lowest</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-bold">Filter by Storage</label>
                <select onChange={handleFilterChange} value={filterOption} className="select select-bordered bg-white w-full">
                    <option value="">All</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                </select>
            </div>

            <div className="divider"></div>

            <button className="btn btn-primary w-full mb-2" onClick={onAddProductClick}>
                Add Product
            </button>

            <button className={`btn ${deleteMode ? 'btn-error' : 'btn-outline'} w-full`} onClick={onDeleteModeToggle}>
                {deleteMode ? "Exit Delete Mode" : "Delete Products"}
            </button>
        </div>
    );
};

export default SortFilterPanel;
