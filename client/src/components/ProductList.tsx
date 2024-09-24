import {Link} from "react-router-dom";
import {useAtom} from "jotai";
import {currentPageAtom, filterOptionAtom, productsAtom, sortOptionAtom} from "../atoms/productAtoms.ts";

//Component displaying a list of the products + ability to filter and search
const pageSize = 12;

const ProductList: React.FC = () => {
    const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
    const [sortOption, setSortOption] = useAtom(sortOptionAtom);
    const [filterOption, setFilterOption] = useAtom(filterOptionAtom);
    const [products] = useAtom(productsAtom);

    //Calculate index range for the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    //Filter and sort products
    const filteredProducts = products.filter((product) => {
        if (filterOption === 'In Stock') return product.storage === 'In Stock';
        if (filterOption === 'Out of Stock') return product.storage === 'Out of Stock';
        if (filterOption === 'Low Stock') return product.storage === 'Low Stock';
        return true; //No filter
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === 'price-low-high') return a.price - b.price;
        if (sortOption === 'price-high-low') return b.price - a.price;
        return 0; //No sort
    });

    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(products.length / pageSize);


    //------HANDLERS-------
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOption(e.target.value);
    };

    const handleAddProductClick = () => {
        alert("Add product not yet implemented");
    };

    return (
        <div className="p-4 bg-base-100 min-h-screen flex">
            {/*Sidebar*/}
            <div className="w-1/4 p-4">
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Sort by Price</label>
                    <select onChange={handleSortChange} className="select select-bordered bg-white w-full">
                        <option value="">Select...</option>
                        <option value="price-low-high">Lowest to Highest</option>
                        <option value="price-high-low">Highest to Lowest</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">Filter by Storage</label>
                    <select onChange={handleFilterChange} className="select select-bordered bg-white w-full">
                        <option value="">All</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Low Stock">Low Stock</option>
                    </select>
                </div>

                <button className="btn btn-primary w-full" onClick={handleAddProductClick}>
                    Add Product
                </button>
            </div>

            {/*Main List*/}
            <div className="w-3/4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedProducts.map((product) => (
                        <Link key={product.id} to={`/product/${product.id}`}>
                            <div className="card shadow-md bg-white text-base-content hover:bg-primary hover:text-white transition-colors h-full">
                                <div className="card-body flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="card-title text-xl font-bold">{product.name}</h2>
                                        <p className="text-sm">{product.storage}</p>
                                    </div>
                                    <div className="text-xl font-bold">{product.price}$</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/*Pagination Controls*/}
                <div className="flex justify-center items-center mt-6">
                    <button
                        onClick={handlePreviousPage}
                        className="btn btn-outline"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-4">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        className="btn btn-outline"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;