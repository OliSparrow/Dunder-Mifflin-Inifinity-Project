import React from 'react';
import { useAtom } from 'jotai';
import { filterOptionAtom, sortOptionAtom } from '../../atoms/productAtoms';

const AdminSortFilterPanel: React.FC = () => {
    //----ATOMS----
    const [sortOption, setSortOption] = useAtom(sortOptionAtom);
    const [filterOption, setFilterOption] = useAtom(filterOptionAtom);

    //----HANDLERS----
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOption(e.target.value);
    };

    //----STYLING----
    return (
        <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Sort by Price */}
            <div className="flex flex-col">
                <label className="font-bold mb-1">Sort by Price</label>
                <select
                    onChange={handleSortChange}
                    value={sortOption}
                    className="select select-bordered bg-white"
                >
                    <option value="">Select...</option>
                    <option value="price-low-high">Lowest to Highest</option>
                    <option value="price-high-low">Highest to Lowest</option>
                </select>
            </div>

            {/* Filter by Stock */}
            <div className="flex flex-col">
                <label className="font-bold mb-1">Filter by Stock</label>
                <select
                    onChange={handleFilterChange}
                    value={filterOption}
                    className="select select-bordered bg-white"
                >
                    <option value="">All</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Discontinued">Discontinued</option>
                </select>
            </div>
        </div>
    );
};

export default AdminSortFilterPanel;
