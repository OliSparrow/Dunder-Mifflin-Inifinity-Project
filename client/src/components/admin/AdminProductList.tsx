import React, { useState } from 'react';
import { useAtom } from 'jotai';
import {filterOptionAtom, productsAtom, sortOptionAtom, searchQueryAtom} from '../../atoms/productAtoms.ts';
import { FaTrash, FaCheck, FaEdit } from 'react-icons/fa';

const AdminProductList: React.FC = () => {
    //----ATOMS----
    const [products] = useAtom(productsAtom);
    const [filterOption] = useAtom(filterOptionAtom);
    const [sortOption] = useAtom(sortOptionAtom);
    const [searchQuery] = useAtom(searchQueryAtom);

    //----USE STATES----
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);

    //----FILTER AND SORT-----
    const filteredProducts = products.filter((product) => {
        // Filter by storage option
        let matchesFilter = true;
        if (filterOption === 'In Stock') {
            matchesFilter = product.storage === 'In Stock';
        } else if (filterOption === 'Out of Stock') {
            matchesFilter = product.storage === 'Out of Stock';
        } else if (filterOption === 'Low Stock') {
            matchesFilter = product.storage === 'Low Stock';
        }

        // Filter by search query
        let matchesSearchQuery = true;
        if (searchQuery) {
            matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        // Return true if both conditions are met
        return matchesFilter && matchesSearchQuery;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === "price-low-high") return a.price - b.price;
        if (sortOption === "price-high-low") return b.price - a.price;
        return 0;  //No sorting applied
    });

    //----HANDLERS----
    const handleAddProductClick = () => {
        alert("Add product not yet implemented");
    };

    const handleEditProductClick = () => {
        alert("Edit Product not yet implemented");
    };

    const handleSelectProduct = (id: number) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedProducts.length > 0) {
            alert("Delete selected products functionality is not yet implemented.");
        } else {
            alert("No products selected.");
        }
        setSelectedProducts([]);
        setDeleteMode(false);
    };

    const handleDeleteProduct = (id: number) => {
        alert(`Delete product with id ${id} functionality is not yet implemented.`);
    };

    const toggleDeleteMode = () => {
        if (deleteMode && selectedProducts.length === 0) {
            setDeleteMode(false);
        } else {
            setDeleteMode(!deleteMode);
        }
        setSelectedProducts([]);
    };


    //----STYLING----
    return (
        <div className="w-full p-4 bg-base-100">
            <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

            <button className="btn btn-primary mb-4 mr-1" onClick={handleAddProductClick}>
                Add Product
            </button>

            <button
                className={`btn mb-4 ${deleteMode ? 'btn-warning' : 'btn-error'}`}
                onClick={deleteMode ? handleDeleteSelected : toggleDeleteMode}
            >
                {deleteMode ? "Delete Selected" : "Delete Multiple"}
            </button>

            <table className="table bg-white shadow-md table-zebra w-full">
                <thead>
                <tr>
                    <th>{deleteMode ? "Select" : "Delete"}</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Storage</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedProducts.map((product) => (
                    <tr
                        key={product.id}
                        className={`${deleteMode && selectedProducts.includes(product.id) ? 'bg-red-200' : ''}`}
                        onClick={() => deleteMode && handleSelectProduct(product.id)} // Click anywhere to select in delete mode
                    >
                        <td>
                            {deleteMode ? (
                                selectedProducts.includes(product.id) ? (
                                    <FaCheck className="text-green-600" />
                                ) : (
                                    <span></span>
                                )
                            ) : (
                                <FaTrash
                                    className="cursor-pointer text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents triggering row click
                                        handleDeleteProduct(product.id);
                                    }}
                                />
                            )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price}$,-</td>
                        <td>{product.storage}</td>
                        <td>
                            <FaEdit
                                className="cursor-pointer text-blue-600 size-4"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents triggering row click
                                    handleEditProductClick();
                                }}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductList;