import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { filterOptionAtom, productsAtom, sortOptionAtom, searchQueryAtom, Product } from '../../atoms/productAtoms.ts';
import { FaTrash, FaCheck, FaEdit } from 'react-icons/fa';
import AddProductForm from './CRUD/AddProductForm.tsx';
import EditProductForm from './CRUD/EditProductForm';
import axios from 'axios';

const AdminProductList: React.FC = () => {
    // ---- ATOMS ----
    const [products, setProducts] = useAtom(productsAtom);
    const [filterOption] = useAtom(filterOptionAtom);
    const [sortOption] = useAtom(sortOptionAtom);
    const [searchQuery] = useAtom(searchQueryAtom);

    // ---- USE STATES ----
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

        // Filter by search query
        let matchesSearchQuery = true;
        if (searchQuery) {
            matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        // Return true if both conditions are met
        return matchesFilter && matchesSearchQuery;
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
        if (selectedProducts.length > 0) {
            const confirmed = window.confirm('Are you sure you want to delete the selected products?');
            if (confirmed) {
                try {
                    await Promise.all(
                        selectedProducts.map((id) => axios.delete(`http://localhost:5000/api/paper/${id}`))
                    );
                    setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
                    setSelectedProducts([]);
                    setDeleteMode(false);
                } catch (error) {
                    console.error('Error deleting products:', error);
                }
            }
        } else {
            alert('No products selected.');
        }
    };

    const handleDeleteProduct = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/paper/${id}`);
                setProducts(products.filter((product) => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const toggleDeleteMode = () => {
        if (deleteMode && selectedProducts.length === 0) {
            setDeleteMode(false);
        } else {
            setDeleteMode(!deleteMode);
        }
        setSelectedProducts([]);
    };

    // ---- STYLING ----
    return (
        <div className="w-full p-4">
            <button className="btn btn-primary mb-4" onClick={handleAddProductClick}>
                Add Product
            </button>
            
            <button
                className={`btn mb-2 ${deleteMode ? 'btn-warning' : 'btn-error'}`}
                onClick={deleteMode ? handleDeleteSelected : toggleDeleteMode}>
                {deleteMode ? 'Delete Selected' : 'Delete Multiple'}
            </button>
            

            <table className="table bg-white shadow-md table-zebra w-full">
                <thead>
                <tr>
                    <th>{deleteMode ? 'Select' : 'Delete'}</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Discontinued</th>
                    <th>Properties</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedProducts.map((product) => (
                    <tr
                        key={product.id}
                        className={`${
                            deleteMode && selectedProducts.includes(product.id) ? 'bg-red-200' : ''
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
                        <td className="whitespace-normal break-words">{product.name}</td>
                        <td>{product.price}$</td>
                        <td>{product.stock}</td>
                        <td>{product.discontinued ? 'Yes' : 'No'}</td>
                        <td className="whitespace-normal break-words">
                            {product.paperProperties.map((pp) => pp.property.property_name).join(', ')}
                        </td>
                        <td>
                            <FaEdit
                                className="cursor-pointer text-blue-600"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleEditProductClick(product);
                                }}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            {showAddForm && <AddProductForm onClose={() => setShowAddForm(false)} />}

            {editingProduct && (
                <EditProductForm product={editingProduct} onClose={() => setEditingProduct(null)} />
            )}
        </div>
    );
};

export default AdminProductList;