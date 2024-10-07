import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { productsAtom, propertiesAtom, Product, Property } from '../../../atoms/productAtoms.ts';
import axios from "axios";

const EditProductForm: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
    //----ATOMS----
    const [products, setProducts] = useAtom(productsAtom);
    const [properties, setProperties] = useAtom(propertiesAtom);

    //----USE STATES----
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [stock, setStock] = useState(product.stock);
    const [discontinued, setDiscontinued] = useState(product.discontinued);
    const [selectedProperties, setSelectedProperties] = useState<number[]>(product.paperProperties.map(pp => pp.propertyId));

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

        const updatedProduct = {
            paper: {
                id: product.id, // Ensure ID is included
                name,
                price: parseFloat(price),
                stock: parseInt(stock.toString()),
                discontinued,
            },
            propertyIds: selectedProperties, // Include property IDs
        };

        console.log("Updating product:", updatedProduct);

        try {
            const response = await axios.put<Product>(`http://localhost:5000/api/paper/${product.id}`, updatedProduct);
            setProducts(products.map(p => (p.id === product.id ? response.data : p)));
            onClose(); // Close modal after submission
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Server Error:', error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Network Error:', error.message);
            } else {
                // Something else caused the error
                console.error('Error:', error.message);
            }
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
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
