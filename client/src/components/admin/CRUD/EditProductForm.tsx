import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { productsAtom, propertiesAtom } from '../../../atoms/productAtoms.ts';
import axios, { AxiosError } from "axios";
import {FaCheck} from "react-icons/fa";
import {Product, Property} from "../../types.ts";


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
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.error('Error fetching properties:', axiosError.response.data);
                } else if (axiosError.request) {
                    console.error('Error fetching properties: No response received', axiosError.request);
                } else {
                    console.error('Error:', axiosError.message);
                }
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
                id: product.id,
                name,
                price: parseFloat(price),
                stock: parseInt(stock.toString()),
                discontinued,
            },
            propertyIds: selectedProperties,
        };

        console.log("Updating product:", updatedProduct);

        try {
            const response = await axios.put<Product>(`http://localhost:5000/api/paper/${product.id}`, updatedProduct);
            setProducts(products.map(p => (p.id === product.id ? response.data : p)));
            onClose();
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error('Error updating product:', axiosError.response.data);
                alert('Error updating product: ' + axiosError.response.data.message);
            } else if (axiosError.request) {
                console.error('Error updating product: No response received', axiosError.request);
            } else {
                console.error('Error:', axiosError.message);
            }
        }
    };

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
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
                <h3 className="font-bold text-lg">Edit Product</h3>
                <form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div className="form-control">
                        <label className="label font-bold">
                            <span className="label-text font-bold">Product Name</span>
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
                            <span className="label-text font-bold">Price</span>
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
                        <label className="label font-bold">
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
