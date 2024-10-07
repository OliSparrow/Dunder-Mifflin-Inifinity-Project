import React, {useEffect, useState} from 'react';
import { useAtom } from 'jotai';
import {Product, productsAtom, propertiesAtom, Property} from '../../../atoms/productAtoms.ts';
import axios from "axios";


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

                    {/* Property Selection */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select Properties</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {properties.map((property) => (
                                <label key={property.id} className="cursor-pointer flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={property.id}
                                        checked={selectedProperties.includes(property.id)}
                                        onChange={(e) => {
                                            const propertyId = parseInt(e.target.value);
                                            setSelectedProperties((prevSelected) =>
                                                prevSelected.includes(propertyId)
                                                    ? prevSelected.filter((id) => id !== propertyId)
                                                    : [...prevSelected, propertyId]
                                            );
                                        }}
                                    />
                                    <span>{property.propertyName}</span>
                                </label>
                            ))}
                        </div>
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