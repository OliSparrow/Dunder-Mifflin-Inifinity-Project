import React, {  useState } from 'react';
import { useAtom } from 'jotai';
import { productsAtom, Product } from '../../../atoms/productAtoms.ts';
import axios from "axios";

const EditProductForm: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
    //----ATOMS----
    const [products, setProducts] = useAtom(productsAtom);

    //----USE STATES----
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [stock, setStock] = useState(product.stock);
    const [discontinued, setDiscontinued] = useState(product.discontinued);

    //----HANDLERS----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedProduct = {
            id: product.id,
            name,
            price: parseFloat(price),
            stock: parseInt(stock.toString()),
            discontinued,
        };

        console.log("Updating product:", updatedProduct);

        try {
            const response = await axios.put(`http://localhost:5000/api/paper/${product.id}`, updatedProduct);
            setProducts(products.map(p => (p.id === product.id ? response.data : p)));
            onClose(); // Close modal after submission
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Makes sure that it only closes on background clicks
    };

    //----STYLING----
    return (
        <div className="modal modal-open" onClick={onClose}>
            <div className="modal-box" onClick={handleModalContentClick}>
                <h3 className="font-bold text-lg">Edit Product</h3>
                <form onSubmit={handleSubmit}>
                    {/* Product Name */}
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

                    {/* Product Price */}
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

                    {/* Stock Quantity */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Stock Quantity</span>
                        </label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value))}
                            className="input input-bordered"
                            required
                        />
                    </div>

                    {/* Discontinued Toggle */}
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Discontinued</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={discontinued}
                                onChange={(e) => setDiscontinued(e.target.checked)}
                            />
                        </label>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
