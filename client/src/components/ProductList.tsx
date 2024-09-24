import React, {useState} from "react";
import { useAtom } from "jotai";
import {currentPageAtom, filterOptionAtom, productsAtom, sortOptionAtom} from "../atoms/productAtoms.ts";
import SortFilterPanel from './SortFilterPanel';
import {Link} from "react-router-dom";

//Component displaying a list of the products + ability to filter and search
const pageSize = 12;

const ProductList: React.FC = () => {
    //----ATOMS----
    const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
    const [products] = useAtom(productsAtom);
    const [filterOption] = useAtom(filterOptionAtom);
    const [sortOption] = useAtom(sortOptionAtom);

    //----USESTATES----
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    //Filter and sort products
    const filteredProducts = products.filter((product) => {
        if (filterOption === "In Stock") return product.storage === "In Stock";
        if (filterOption === "Out of Stock") return product.storage === "Out of Stock";
        if (filterOption === "Low Stock") return product.storage === "Low Stock";
        return true; //No filter applied
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === "price-low-high") return a.price - b.price;
        if (sortOption === "price-high-low") return b.price - a.price;
        return 0;  //No sorting applied
    });

    //Check if product is selected
    const isProductSelected = (id: number) => selectedProducts.includes(id);

    //Calculate index range for the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sortedProducts.length / pageSize);

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

    const handleAddProductClick = () => {
        alert("Add product not yet implemented");
    };

    //Toggle delete mode
    const handleDeleteModeToggle = () => {
        if (deleteMode && selectedProducts.length > 0) {
            alert("Delete product functionality is not yet implemented.");
        }
        setDeleteMode(!deleteMode);
        setSelectedProducts([]); //Clear selected products on exit
    };

    //Toggle product selection
    const handleProductSelect = (id: number) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    };

    return (
        <div className="p-4 bg-base-100 min-h-screen flex">
            {/*Sidebar with sorting and filtering*/}
            <SortFilterPanel
                onAddProductClick={handleAddProductClick}
                onDeleteModeToggle={handleDeleteModeToggle}
                deleteMode={deleteMode}
            />

            <div className="divider divider-horizontal"></div>

            {/*Main List*/}
            <div className="w-3/4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedProducts.map((product) => {
                        const productCard = (
                            <div
                                key={product.id}
                                className={`card shadow-md bg-white text-base-content h-full ${deleteMode && isProductSelected(product.id) ? 'bg-red-200' : 'hover:bg-primary hover:text-white transition-colors'}`}
                                onClick={() => deleteMode && handleProductSelect(product.id)}
                            >
                                <div className="card-body flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="card-title text-xl font-bold">{product.name}</h2>
                                        <p className="text-sm">{product.storage}</p>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="text-xl font-bold flex justify-end">{product.price}$,-</div>
                                </div>
                            </div>
                        );

                        //!!!!Only wrap the card with a Link if deleteMode is off
                        return deleteMode ? (
                            productCard
                        ) : (
                            <Link key={product.id} to={`/product/${product.id}`}>
                                {productCard}
                            </Link>
                        );
                    })}
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