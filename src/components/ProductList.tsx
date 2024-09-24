import React from "react";

//Component displaying a list of the products + ability to filter and search
const products = [
    { id: 1, name: 'Canon Pixma Printer', price: '40$', storage: 'In Stock' },
    { id: 2, name: 'HP Envy Printer', price: '100$', storage: 'In Stock' },
    { id: 3, name: 'Epson Ink - Black', price: '15$', storage: 'In Stock' },
    //Placeholder objects until actual DB logic has been applied
];

const ProductList: React.FC = () => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="card shadow-md compact bg-base-100">
                        <div className="card-body">
                            <h2 className="card-title">{product.name}</h2>
                            <p className="text-sm">{product.storage}</p>
                            <div className="text-xl font-bold">{product.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
