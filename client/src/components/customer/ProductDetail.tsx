import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useAtom} from "jotai";
import {productsAtom} from "../../atoms/productAtoms.ts";
import {FiShoppingCart} from "react-icons/fi";

//Component that will be responsible for displaying more detailed info about a product
const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [products] = useAtom(productsAtom);

    //Manage quantity selected by user
    const [quantity, setQuantity] = useState<number>(1);

    //Find the PRoduct by its ID
    const product = products.find((p) => p.id === Number(id));

    //If product isn't found, display a message:
    if (!product) {
        return (
            <div className="p-4 bg-base-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Product not found</h1>
                <p>The product with ID {id} does not exist.</p>
            </div>
        );
    }

    //------HANDLERS-------
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Math.max(1, Number(e.target.value)); // Ensure at least 1 item
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        //Placeholder for adding to cart
        alert(`Added ${quantity} of ${product.name} to the cart`);
    };


    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <div className="card shadow-lg bg-white text-base-content p-6">
                {/*Product details*/}
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg mb-2">Price: ${product.price}</p>
                <p className="text-md mb-6">Storage: {product.storage}</p>

                <div className="text-sm mb-6">
                    This is a detailed description of the product with ID {id}.
                </div>

                {/*Button to add + quantity input*/}
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
        </div>
    );
};

export default ProductDetail;