import React from "react";
import {useParams} from "react-router-dom";

//Component that will be responsible for displaying more detailed info about a product
const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="p-4 bg-base-100 min-h-screen">
            <div className="card shadow-lg bg-white text-base-content p-6">
                {/*Placeholder text*/}
                <h1 className="text-3xl font-bold mb-4">Product Detail for ID: {id}</h1>
                <p className="text-lg mb-2">Price: 40$</p>
                <p className="text-md mb-6">Storage: In Stock</p>

                <div className="text-sm mb-6">
                    This is a detailed description of the product with ID {id}.
                </div>

                <button className="btn btn-primary">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;