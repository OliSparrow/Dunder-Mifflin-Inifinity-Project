import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { productsAtom } from "../../atoms/productAtoms.ts";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import {cartAtom} from "../../atoms/cartAtom.ts";

const ProductDetail: React.FC = () => {
    //---- ATOMS -----
    const [products] = useAtom(productsAtom);
    const [cart, setCart] = useAtom(cartAtom);

    //---- FIND PRODUCT BY ID -----
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState<number>(1);
    const product = products.find((p) => p.id === Number(id));
    const navigate = useNavigate(); 

    if (!product) {  
        return (
            <div className="p-4 bg-base-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Product not found</h1>
                <p>The product with ID {id} does not exist.</p>
            </div>
        );
    }

    //------ HANDLERS ------
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Math.max(1, Number(e.target.value)); 
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { product, quantity }];
            }
        });
        alert(`Added ${quantity} of ${product.name} to the cart`);
    };

    const handleBackToList = () => {
        navigate('/'); //Navigate back to the product list page
    };

    //------ RENDER PROPERTIES ------
    const renderProperties = () => {
        if (product.paperProperties.length === 0) {
            return <p>No Properties</p>;
        }

        return (
            <ul className="list-disc list-inside">
                {product.paperProperties.map((pp) => (
                    <li key={pp.propertyId}>{pp.property.propertyName}</li>
                ))}
            </ul>
        );
    };

    //---- STYLING -----
    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <div className="card shadow-lg bg-white text-base-content p-6">
                {/* Product details */}
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg mb-2">Price: ${product.price}</p>
                <p className="text-md mb-6">Storage: {product.stock}</p>

                {/* Product properties */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Properties</h2>
                    {renderProperties()}
                </div>

                {/* Button to add + quantity input */}
                <div className="flex justify-end items-center gap-4">
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="input input-bordered bg-white w-16"
                    />
                    <button className="btn btn-primary" onClick={handleAddToCart}>
                        <FiShoppingCart className="mr-2"/>
                        Add to Cart
                    </button>
                </div>
            </div>
            
            {/* Back to Product List Button */}
            <div className="mt-6">
                <button className="btn btn-outline" onClick={handleBackToList}>
                    <FiArrowLeft/>
                    Back
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
