import React, {useState} from "react";
import { useAtom } from "jotai";
import {currentPageAtom, filterOptionAtom, productsAtom, sortOptionAtom} from "../../atoms/productAtoms.ts";
import SortFilterPanel from './SortFilterPanel';
import AdminProductList from '../admin/AdminProductList.tsx'
import AdminSortFilterPanel from '../admin/AdminSortFilterPanel.tsx'
import {Link} from "react-router-dom";

//Component displaying a list of the products + ability to filter and search
//---SPECIFICALLY FOR CUSTOMERS---

const pageSize = 12;

const ProductList: React.FC = () => {
    //----ATOMS----
    const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
    const [products] = useAtom(productsAtom);
    const [filterOption] = useAtom(filterOptionAtom);
    const [sortOption] = useAtom(sortOptionAtom);

    //----USE STATES----
    const [adminMode, setAdminMode] = useState(false);

    //----FILTER AND SORT-----
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

    //----PAGINATION-----
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedProducts.length / pageSize);

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

    //----STYLING----
    return (
        <div className="p-4 bg-base-100 min-h-screen flex">
            {adminMode ? (
                <>
                    <AdminSortFilterPanel setAdminMode={setAdminMode} />
                    <AdminProductList />
                </>
            ) : (
                <>
                    <SortFilterPanel setAdminMode={setAdminMode} />
                    <div className="divider divider-horizontal"></div>
                    <div className="w-3/4 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedProducts.map((product) => (
                                <Link key={product.id} to={`/product/${product.id}`}>
                                    <div className="card shadow-md bg-white text-base-content h-full hover:bg-primary hover:text-white transition-colors">
                                        <div className="card-body flex flex-col justify-between h-full">
                                            <div>
                                                <h2 className="card-title text-xl font-bold">{product.name}</h2>
                                                <p className="text-sm">{product.storage}</p>
                                            </div>
                                            <div className="divider"></div>
                                            <div className="text-xl font-bold flex justify-end">{product.price}$,-</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center items-center mt-6">
                            <button className="btn btn-outline" disabled={currentPage === 1} onClick={handlePreviousPage}>
                                Previous
                            </button>
                            <span className="mx-4">Page {currentPage} of {totalPages}</span>
                            <button className="btn btn-outline" disabled={currentPage === totalPages} onClick={handleNextPage}>
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductList;