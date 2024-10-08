import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { productsAtom, searchQueryAtom } from '../../atoms/productAtoms';
import { FaTrash, FaCheck, FaEdit, FaFilter } from 'react-icons/fa';
import AddProductForm from './CRUD/AddProductForm';
import EditProductForm from './CRUD/EditProductForm';
import axios, { AxiosError } from 'axios';
import { Product } from "../types.ts";

const AdminProductList: React.FC = () => {
    // ---- ATOMS ----
    const [products, setProducts] = useAtom(productsAtom);
    const [searchQuery] = useAtom(searchQueryAtom);

    // ---- USE STATES ----
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        stockFilter: '', // '', 'In Stock', 'Out of Stock', 'Low Stock'
        discontinued: false,
        sortOption: '', // '', 'price-low-high', 'price-high-low'
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>('http://localhost:5000/api/Paper');
                setProducts(response.data);
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.error('Error fetching products:', axiosError.response.data);
                } else if (axiosError.request) {
                    console.error('Error fetching products: No response received', axiosError.request);
                } else {
                    console.error('Error:', axiosError.message);
                }
            }
        };

        fetchProducts();
    }, [setProducts]);

    // Determine if filters are active
    const areFiltersActive = () => {
        return (filterOptions.stockFilter !== '' || filterOptions.discontinued || filterOptions.sortOption !== '');
    };

    // ---- FILTER AND SORT ----
    const filteredProducts = products.filter((product) => {
        let matchesFilter = true;

        // Filter by stock levels
        if (filterOptions.stockFilter === 'In Stock') {
            matchesFilter = product.stock > 0;
        } else if (filterOptions.stockFilter === 'Out of Stock') {
            matchesFilter = product.stock === 0;
        } else if (filterOptions.stockFilter === 'Low Stock') {
            matchesFilter = product.stock > 0 && product.stock < 5;
        }

        // Filter discontinued products
        if (filterOptions.discontinued) {
            matchesFilter = matchesFilter && product.discontinued;
        }
        // Filter by search query
        let matchesSearchQuery = true;
        if (searchQuery) {
            matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return matchesFilter && matchesSearchQuery;
    });

    // Apply sorting based on sortOption
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (filterOptions.sortOption === 'price-low-high') return a.price - b.price;
        if (filterOptions.sortOption === 'price-high-low') return b.price - a.price;
        return 0; // No sorting applied
    });

    // ---- HANDLERS ----
    const handleAddProductClick = () => {
        setShowAddForm(true);
    };

    const handleEditProductClick = (product: Product) => {
        setEditingProduct(product);
    };

    const handleSelectProduct = (id: number) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteProduct = async (id: number) => {
        const product = products.find((p) => p.id === id);
        setProductToDelete(product || null);
        setShowDeleteModal(true); 
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/Paper/${productToDelete.id}`);
            setProducts(products.filter((product) => product.id !== productToDelete.id));
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error('Error deleting product:', axiosError.response.data);
                alert('Error deleting product: ' + axiosError.response.data.message);
            } else if (axiosError.request) {
                console.error('Error deleting product: No response received', axiosError.request);
            } else {
                console.error('Error:', axiosError.message);
            }
        } finally {
            setShowDeleteModal(false); 
            setProductToDelete(null);  
        }
    };

    const handleDeleteSelected = () => {
        setShowDeleteMultipleModal(true);
    };

    const handleConfirmDeleteMultiple = async () => {
        try {
            await Promise.all(
                selectedProducts.map(async (id) => {
                    try {
                        await axios.delete(`http://localhost:5000/api/Paper/${id}`);
                    } catch (error: unknown) {
                        const axiosError = error as AxiosError;
                        if (axiosError.response) {
                            console.error(`Error deleting product with ID ${id}:`, axiosError.response.data);
                        } else if (axiosError.request) {
                            console.error(`Error deleting product with ID ${id}: No response received`, axiosError.request);
                        } else {
                            console.error('Error:', axiosError.message);
                        }
                    }
                })
            );

            setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
            setSelectedProducts([]);
            setDeleteMode(false);
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error('Error deleting multiple products:', axiosError.response.data);
            } else if (axiosError.request) {
                console.error('Error deleting multiple products: No response received', axiosError.request);
            } else {
                console.error('Error:', axiosError.message);
            }
        } finally {
            setShowDeleteMultipleModal(false);
        }
    };

    const handleDeleteButtonClick = () => {
        if (deleteMode) {
            if (selectedProducts.length > 0) {
                handleDeleteSelected();
            } else {
                setDeleteMode(false);
                setSelectedProducts([]);
            }
        } else {
            setDeleteMode(true);
        }
    };

    // ---- Filter Modal Component ----
    const FilterModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Filter Options</h2>
                {/* Stock Level Filter */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Stock Level:</label>
                    <select
                        className="select select-bordered w-full"
                        value={filterOptions.stockFilter}
                        onChange={(e) =>
                            setFilterOptions({ ...filterOptions, stockFilter: e.target.value })
                        }
                    >
                        <option value="">All</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Low Stock">Low Stock</option>
                    </select>
                </div>
                {/* Discontinued Filter */}
                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={filterOptions.discontinued}
                            onChange={(e) =>
                                setFilterOptions({
                                    ...filterOptions,
                                    discontinued: e.target.checked,
                                })
                            }
                        />
                        <span className="font-semibold">Show Discontinued Only</span>
                    </label>
                </div>
                {/* Sort by Price */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Sort by Price:</label>
                    <select
                        className="select select-bordered w-full"
                        value={filterOptions.sortOption}
                        onChange={(e) =>
                            setFilterOptions({ ...filterOptions, sortOption: e.target.value })
                        }
                    >
                        <option value="">No Sorting</option>
                        <option value="price-low-high">Low to High</option>
                        <option value="price-high-low">High to Low</option>
                    </select>
                </div>
                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setFilterModalOpen(false)}
                    >
                        Close
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setFilterModalOpen(false)}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    // ---- STYLING ----
    return (
        <div className="w-full p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4">
                {/* Left Side Buttons */}
                <div className="flex items-center gap-2">
                    {!deleteMode && (
                        <button className="btn btn-primary" onClick={handleAddProductClick}>
                            Add Product
                        </button>
                    )}

                    <button
                        className={`btn ${deleteMode ? 'btn-error' : 'btn-error'}`}
                        onClick={handleDeleteButtonClick}
                    >
                        {deleteMode
                            ? selectedProducts.length > 0
                                ? `Delete Selected (${selectedProducts.length})`
                                : 'Exit Delete Mode'
                            : 'Delete Multiple'}
                    </button>

                    {deleteMode && (
                        <button
                            className="btn btn-outline"
                            disabled={selectedProducts.length === 0}
                            onClick={() => setSelectedProducts([])}
                        >
                            {selectedProducts.length > 0
                                ? `Clear Selections (${selectedProducts.length})`
                                : 'Clear Selections'}
                        </button>
                    )}
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center gap-2">
                    {areFiltersActive() && (
                        <button
                            className="btn btn-outline"
                            onClick={() =>
                                setFilterOptions({
                                    stockFilter: '',
                                    discontinued: false,
                                    sortOption: '',
                                })
                            }
                        >
                            Clear Filters
                        </button>
                    )}

                    <button
                        className="btn btn-secondary"
                        onClick={() => setFilterModalOpen(true)}
                    >
                        <FaFilter className="mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto shadow-md">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>{deleteMode ? 'Select' : 'Delete'}</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Discontinued</th>
                        <th className="hidden lg:table-cell">Properties</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedProducts.map((product) => (
                        <tr
                            key={product.id}
                            className={`${
                                deleteMode && selectedProducts.includes(product.id)
                                    ? 'bg-red-200'
                                    : ''
                            }`}
                            onClick={() => {
                                if (deleteMode) {
                                    handleSelectProduct(product.id);
                                }
                            }}
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
                            <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4">
                                {product.name}
                            </td>
                            <td className="text-sm md:text-base p-2 md:p-4">
                                {product.price}$
                            </td>
                            <td className="text-sm md:text-base p-2 md:p-4">
                                {product.stock}
                            </td>
                            <td className="text-sm md:text-base p-2 md:p-4">
                                {product.discontinued ? 'Yes' : 'No'}
                            </td>
                            <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4 hidden lg:table-cell">
                                {product.paperProperties
                                    .map((pp) => pp.property?.propertyName || 'Unknown')
                                    .join(', ')}
                            </td>
                            <td className="p-2 md:p-4">
                                <FaEdit
                                    className="cursor-pointer text-blue-600"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents triggering row click
                                        handleEditProductClick(product);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showAddForm && <AddProductForm onClose={() => setShowAddForm(false)} />}

            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}

            {/* Delete Confirmation Modal for Single Product */}
            {showDeleteModal && productToDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Product</h3>
                        <p>Are you sure you want to delete the product "{productToDelete.name}"?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal for Multiple Products */}
            {showDeleteMultipleModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Selected Products</h3>
                        <p>Are you sure you want to delete the selected products?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleConfirmDeleteMultiple}>
                                Delete
                            </button>
                            <button className="btn" onClick={() => setShowDeleteMultipleModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Render Filter Modal */}
            {filterModalOpen && <FilterModal />}
        </div>
    );
};

export default AdminProductList;
