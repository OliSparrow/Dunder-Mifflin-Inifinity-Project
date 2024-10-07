import React, {useEffect, useState} from 'react';
import { useAtom } from 'jotai';
import {Product, productsAtom, propertiesAtom, Property} from '../../../atoms/productAtoms.ts';
import axios from "axios";
import {FaCheck} from "react-icons/fa";


const AddProductForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    //----ATOMS----
    const [products, setProducts] = useAtom(productsAtom);
    const [properties, setProperties] = useAtom(propertiesAtom);

    //----USE STATES----
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(0);
    const [discontinued, setDiscontinued] = useState(false);
    const [selectedProperties, setSelectedProperties] = useState<number[]>([]);

    //----USE EFFECTS----
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get<Property[]>('http://localhost:5000/api/property');
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties', error);
            }
        };

        if (properties.length === 0) {
            fetchProperties();
        }
    }, [properties, setProperties]);
    
    //----HANDLERS----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            paper: {
                name,
                price: parseFloat(price),
                stock,
                discontinued,
            },
            propertyIds: selectedProperties,
        };

        console.log('Submitting product:', newProduct);

        try {
            const response = await axios.post<Product>('http://localhost:5000/api/paper', newProduct);
            setProducts([...products, response.data]);
            onClose();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };
    
    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation(); //Makes sure that it only closes on background clicks
    };

    // --- TOGGLES ---
    const togglePropertySelection = (propertyId: number) => {
        setSelectedProperties((prevSelected) =>
            prevSelected.includes(propertyId)
                ? prevSelected.filter((id) => id !== propertyId)
                : [...prevSelected, propertyId]
        );
    };

    //----STYLING----
    return (
        <div className="modal modal-open" onClick={onClose}>
            <div className="modal-box" onClick={handleModalContentClick}>
                <h3 className="font-bold text-lg">Add New Product</h3>
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

                    {/* Property Selection */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-bold">Select Properties</span>
                        </label>
                        <div className="border rounded overflow-hidden">
                            <ul className="divide-y max-h-36 overflow-y-auto">
                                {properties.map((property) => {
                                    const isSelected = selectedProperties.includes(property.id);
                                    return (
                                        <li
                                            key={property.id}
                                            className={`flex items-center justify-between px-4 py-2 cursor-pointer 
                                                        ${isSelected ? 'bg-blue-100' : 'bg-white'}
                                                        hover:bg-blue-50`}
                                            onClick={() => togglePropertySelection(property.id)}
                                        >
                                            <span>{property.propertyName}</span>
                                            {isSelected && <FaCheck className="text-blue-500" />}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Discontinued Toggle */}
                    <div className="form-control">
                        <label className="label cursor-pointer font-bold">
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
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default AddProductForm;