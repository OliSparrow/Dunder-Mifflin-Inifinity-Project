import React, {useEffect} from "react";
import { useAtom } from "jotai";
import {
    currentPageAtom,
    filterOptionAtom,
    productsAtom,
    sortOptionAtom,
    searchQueryAtom, showDiscontinuedAtom
} from "../../atoms/productAtoms.ts";
import {Link} from "react-router-dom";
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import {Product} from "../types.ts";

//Component displaying a list of the products + ability to filter and search
//---SPECIFICALLY FOR CUSTOMERS---
const pageSize = 12;

const ProductList: React.FC = () => {
    //----ATOMS----
    const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
    const [products, setProducts] = useAtom<Product[]>(productsAtom);
    const [filterOption] = useAtom(filterOptionAtom);
    const [sortOption] = useAtom(sortOptionAtom);
    const [searchQuery] = useAtom(searchQueryAtom);
    const [showDiscontinued] = useAtom(showDiscontinuedAtom);
    
    // ----FETCHING FROM API ----
    useEffect(() => {
        //Fetch the products from the backend
        axios.get<Product[]>('http://localhost:5000/api/paper')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, [setProducts]);

    //----FILTER AND SORT-----
    const filteredProducts = products.filter((product) => {
        let matchesFilter = true;

        //Filter by stock levels
        if (filterOption === 'In Stock') {
            matchesFilter = product.stock > 0;
        } else if (filterOption === 'Out of Stock') {
            matchesFilter = product.stock === 0;
        } else if (filterOption === 'Low Stock') {
            matchesFilter = product.stock > 0 && product.stock < 5;
        }

        // Filter out discontinued products if not showing discontinued
        if (!showDiscontinued && product.discontinued) {
            matchesFilter = false;
        }

        //Filter by search query
        let matchesSearchQuery = true;
        if (searchQuery) {
            matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        //Return true if both conditions are met
        return matchesFilter && matchesSearchQuery;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === "price-low-high") return a.price - b.price;
        if (sortOption === "price-high-low") return b.price - a.price;
        return 0;  //No sorting applied
    });

    //----STOCK ICON LOGIC----
    const getStockIcon = (stock: number) => {
        if (stock > 5) {
            // In Stock - Green Checkmark
            return <FaCheckCircle className="text-green-500" title="In Stock" />;
        } else if (stock > 0 && stock <= 5) {
            // Low Stock - Yellow Exclamation
            return <FaExclamationCircle className="text-yellow-500" title="Low Stock" />;
        } else {
            // Out of Stock - Red X
            return <FaTimesCircle className="text-red-500" title="Out of Stock" />;
        }
    };
    
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
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                        <div
                            className={`card shadow-md bg-white text-base-content h-full hover:bg-primary hover:text-white transition-colors ${
                                product.discontinued ? 'opacity-50' : ''
                            }`}
                        >
                            <div className="card-body flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="card-title text-xl font-bold">{product.name}</h2>
                                    {product.discontinued && (
                                        <p className="text-sm text-red-600">Discontinued</p>
                                    )}
                                </div>
                                <div className="divider"></div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-sm">
                                        <span className="mr-2">Stock:</span>
                                        {getStockIcon(product.stock)}
                                    </div>
                                    <div className="text-xl font-bold">{product.price}$</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6">
                <button
                    className="btn btn-outline"
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                >
                    Previous
                </button>
                <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
                <button
                    className="btn btn-outline"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;