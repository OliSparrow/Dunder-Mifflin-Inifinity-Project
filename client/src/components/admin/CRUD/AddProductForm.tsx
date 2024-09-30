import React, {useState} from 'react';
import { useAtom } from 'jotai';
import { productsAtom } from '../../../atoms/productAtoms.ts';
import axios from "axios";

const AddProductForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    //----ATOMS----
    const [products, setProducts] = useAtom(productsAtom);

    //----USE STATES----
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(0); 
    const [discontinued, setDiscontinued] = useState(false);

    //----HANDLERS----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock.toString()),
            discontinued,
        };

        console.log("Submitting product:", newProduct);

        try {
            const response = await axios.post('http://localhost:5000/api/paper', newProduct);
            setProducts([...products, response.data]);
            onClose();  //Close modal after submission
        } catch (error) {
            console.error('Error adding product:', error);
        }
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
                    {/*Product Name*/}
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

                    {/*Product Price*/}
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

                    {/*Stock Quantity*/}
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

                    {/*Discontinued Toggle*/}
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

                    {/*Action Buttons*/}
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