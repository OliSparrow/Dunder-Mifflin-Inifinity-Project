import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { productsAtom } from '../../../atoms/productAtoms.ts';

// Currently only for demonstration purposes. Will not save upon closure of program.
const AddProductForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    //----ATOMS----
    const [products, setProducts] = useAtom(productsAtom);

    //----USE STATES----
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [storage, setStorage] = useState('In Stock');

    //----HANDLERS----
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct = {
            id: products.length + 1, // Simple ID assignment
            name,
            price: parseFloat(price),
            storage,
        };
        setProducts([...products, newProduct]);
        onClose();
    };

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation(); //Makes sure that it only closes on background clicks
    };

    //----STYLING----
    return (
        <div className="modal modal-open" onClick={onClose}>
            <div className="modal-box" onClick={handleModalContentClick}>
                <h3 className="font-bold text-lg">Add New Product</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Product Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Price</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="input input-bordered"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Storage Status</span>
                        </label>
                        <select
                            value={storage}
                            onChange={(e) => setStorage(e.target.value)}
                            className="select select-bordered"
                        >
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                            <option>Low Stock</option>
                        </select>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
