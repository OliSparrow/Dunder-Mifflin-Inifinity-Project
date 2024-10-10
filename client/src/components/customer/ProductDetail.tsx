import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { productsAtom } from "../../atoms/productAtoms.ts";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { cartAtom } from "../../atoms/cartAtom.ts";

const ProductDetail: React.FC = () => {
    //---- ATOMS -----
    const [products] = useAtom(productsAtom);
    const [cart, setCart] = useAtom(cartAtom);

    //---- FIND PRODUCT BY ID -----
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState<number>(1);
    const [showDiscontinuedModal, setShowDiscontinuedModal] = useState<boolean>(false);
    const [showAddedToCartModal, setShowAddedToCartModal] = useState<boolean>(false);
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
        if (product.discontinued || product.stock === 0) {
            // Show modal if product is discontinued or out of stock
            setShowDiscontinuedModal(true);
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { product, quantity }];
            }
        });

        // Show "Added to Cart" modal
        setShowAddedToCartModal(true);
    };

    const handleBackToList = () => {
        navigate('/'); // Navigate back to the product list page
    };

    const handleCloseDiscontinuedModal = () => {
        setShowDiscontinuedModal(false);
    };

    const handleContinueShopping = () => {
        setShowAddedToCartModal(false);
    };

    const handleGoToCart = () => {
        setShowAddedToCartModal(false);
        navigate('/cart'); // Navigate to cart page
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
            <div className="card shadow-lg bg-white text-base-content p-6 relative">

                {/* Product details */}
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg mb-2">Price: ${product.price}</p>
                <p className="text-md mb-6">Stock: {product.stock}</p>

                {/* Product properties */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Properties</h2>
                    {renderProperties()}
                </div>

                {/* Discontinued or Out of Stock Labels */}
                {product.discontinued && (
                    <span className="badge badge-error absolute bottom-4 left-4">Discontinued</span>
                )}
                {product.stock === 0 && (
                    <span className="badge badge-warning absolute bottom-4 right-4">Out of Stock</span>
                )}

                {/* Button to add + quantity input */}
                <div className="flex justify-end items-center gap-4">
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="input input-bordered bg-white w-16"
                        disabled={product.stock === 0}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                        disabled={product.discontinued || product.stock === 0}
                    >
                        <FiShoppingCart className="mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Back to Product List Button */}
            <div className="mt-6">
                <button className="btn btn-outline" onClick={handleBackToList}>
                    <FiArrowLeft />
                    Back
                </button>
            </div>

            {/* Discontinued or Out of Stock Product Modal */}
            {showDiscontinuedModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Product Unavailable</h3>
                        <p>
                            The product "{product.name}" is {product.discontinued ? "discontinued" : "out of stock"} and cannot be added to the cart.
                        </p>
                        <div className="modal-action">
                            <button className="btn" onClick={handleCloseDiscontinuedModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Added to Cart Modal */}
            {showAddedToCartModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Product Added to Cart</h3>
                        <p>{quantity} of "{product.name}" has been added to your cart.</p>
                        <div className="modal-action flex gap-4">
                            <button className="btn btn-outline" onClick={handleContinueShopping}>
                                Continue Shopping
                            </button>
                            <button className="btn btn-primary" onClick={handleGoToCart}>
                                Go to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
