import React from "react";

//Component displaying a list of the products + ability to filter and search
const ProductList: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/*placeholder product until db logic*/}
            <div className="card shadow-md">
                <div className="card-body">
                    <h2 className="card-title">Product Name</h2>
                    <button className="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
