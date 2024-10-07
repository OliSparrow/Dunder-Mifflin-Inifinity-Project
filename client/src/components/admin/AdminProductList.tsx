import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
    filterOptionAtom,
    productsAtom,
    sortOptionAtom,
    Product,
} from '../../atoms/productAtoms';
import { FaTrash, FaCheck, FaEdit } from 'react-icons/fa';
import AddProductForm from './CRUD/AddProductForm';
import EditProductForm from './CRUD/EditProductForm';
import axios from 'axios';
import AdminSortFilterPanel from './AdminSortFilterPanel';

const AdminProductList: React.FC = () => {
    // ---- ATOMS ----
    const [products, setProducts] = useAtom(productsAtom);
    const [filterOption] = useAtom(filterOptionAtom);
    const [sortOption] = useAtom(sortOptionAtom);

    // ---- USE STATES ----
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>('http://localhost:5000/api/Paper');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [setProducts]);

    // ---- FILTER AND SORT ----
    const filteredProducts = products.filter((product) => {
        let matchesFilter = true;

        // Filter by stock levels
        if (filterOption === 'In Stock') {
            matchesFilter = product.stock > 0;
        } else if (filterOption === 'Out of Stock') {
            matchesFilter = product.stock === 0;
        } else if (filterOption === 'Low Stock') {
            matchesFilter = product.stock > 0 && product.stock < 5;
        }

        // Filter discontinued products
        if (filterOption === 'Discontinued') {
            matchesFilter = product.discontinued;
        }

        return matchesFilter;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === 'price-low-high') return a.price - b.price;
        if (sortOption === 'price-high-low') return b.price - a.price;
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

    const handleDeleteSelected = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete the selected products?'
        );
        if (confirmed) {
            try {
                await Promise.all(
                    selectedProducts.map((id) =>
                        axios.delete(`http://localhost:5000/api/Paper/${id}`)
                    )
                );
                setProducts(
                    products.filter((product) => !selectedProducts.includes(product.id))
                );
                setSelectedProducts([]);
                setDeleteMode(false);
            } catch (error) {
                console.error('Error deleting products:', error);
            }
        }
    };

    const handleDeleteProduct = async (id: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this product?'
        );
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/Paper/${id}`);
                setProducts(products.filter((product) => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleDeleteButtonClick = () => {
        if (deleteMode) {
            if (selectedProducts.length > 0) {
                //Delete selected products
                handleDeleteSelected();
            } else {
                //Exit delete mode
                setDeleteMode(false);
                setSelectedProducts([]);
            }
        } else {
            //Enter delete mode
            setDeleteMode(true);
        }
    };

    // ---- STYLING ----
    return (
        <div className="w-full p-4">
            {/* Action Buttons and Sort/Filter Panel */}
            <div className="flex flex-wrap items-center justify-between mb-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button className="btn btn-primary" onClick={handleAddProductClick}>
                        Add Product
                    </button>

                    <button
                        className={`btn ${deleteMode ? 'btn-warning' : 'btn-error'}`}
                        onClick={handleDeleteButtonClick}
                    >
                        {deleteMode
                            ? selectedProducts.length > 0
                                ? `Delete Selected (${selectedProducts.length})`
                                : 'Exit Delete Mode'
                            : 'Delete Multiple'}
                    </button>
                </div>

                {/* Sort and Filter Panel */}
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                    <AdminSortFilterPanel />
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
                                    .map((pp) => pp.property.propertyName)
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
        </div>
    );
};

export default AdminProductList;
