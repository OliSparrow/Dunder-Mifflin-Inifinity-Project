import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { productsAtom } from '../../../atoms/productAtoms.ts';

//----INTERFACE----
interface Product {
    id: number;
    name: string;
    price: number;
    storage: string;
}

//----PROPERTIES----
interface EditProductFormProps {
    product: Product;
    onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose }) => {
    //----ATOMS----
    const [products, setProducts] = useAtom(productsAtom);

    //----USE STATES----
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [storage, setStorage] = useState(product.storage);

    //----HANDLERS----
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedProduct = {
            ...product,
            name,
            price: parseFloat(price),
            storage,
        };

        setProducts(products.map((p) => (p.id === product.id ? updatedProduct : p)));
        onClose();
    };

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    //----STYLING----
    return (
        <div className="modal modal-open" onClick={onClose}>
            <div className="modal-box" onClick={handleModalContentClick}>
                <h3 className="font-bold text-lg">Edit Product</h3>
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;