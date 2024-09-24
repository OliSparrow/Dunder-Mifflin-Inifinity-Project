import React from "react";

//Component that will be responsible for displaying more detailed info about a product
const ProductDetail: React.FC = () => {
    return (
        <div className="p-4">
            <div className="card shadow-lg bg-base-100 p-6">
                <h1 className="text-3xl font-bold mb-4">Canon Pixma Printer</h1>
                <p className="text-lg mb-2">Price: 40$</p>
                <p className="text-md mb-6">Storage: In Stock [8 left]</p>

                <div className="text-sm mb-6">
                    The Canon Pixma Printer has excellent printing capabilities, supports wireless printing, and is perfect for home use!
                </div>

                <button className="btn btn-primary">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;