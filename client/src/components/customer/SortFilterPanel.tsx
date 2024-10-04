import React from 'react';
import { useAtom } from 'jotai';
import { sortOptionAtom, filterOptionAtom } from "../../atoms/productAtoms.ts";

interface SortFilterPanelProps {
    setAdminMode: (value: boolean) => void;
    isAdminMode: boolean;
}

const SortFilterPanel: React.FC<SortFilterPanelProps> = ({ setAdminMode, isAdminMode }) => {
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

    const handleAdminToggle = () => {
        setAdminMode(!isAdminMode);
    };

    //----STYLING----
    return (
        <div className="p-4">
            {!isAdminMode && (
                <>
                    <div className="mb-4">
                        <label htmlFor="sort-select" className="block mb-2 font-bold">
                            Sort by Price
                        </label>
                        <select
                            id="sort-select"
                            onChange={handleSortChange}
                            value={sortOption}
                            className="select select-bordered bg-white w-full"
                        >
                            <option value="">Select...</option>
                            <option value="price-low-high">Lowest to Highest</option>
                            <option value="price-high-low">Highest to Lowest</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="filter-select" className="block mb-2 font-bold">
                            Filter by Stock
                        </label>
                        <select
                            id="filter-select"
                            onChange={handleFilterChange}
                            value={filterOption}
                            className="select select-bordered bg-white w-full"
                        >
                            <option value="">All</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Discontinued">Discontinued</option>
                        </select>
                    </div>

                    <div className="divider"></div>
                </>
            )}

            {/*Admin Toggle Button*/}
            <button className="btn btn-accent w-full" onClick={handleAdminToggle}>
                {isAdminMode ? 'Customer Mode' : 'Admin Mode'}
            </button>
        </div>
    );
};

export default SortFilterPanel;