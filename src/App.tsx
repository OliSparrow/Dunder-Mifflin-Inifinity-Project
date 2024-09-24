import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import OrderHistory from "./components/OrderHistory";
import TopPane from "./components/TopPane";
import ProductDetail from "./components/ProductDetail.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-base-200">
                {/*TOP PANE SHOULD ALWAYS BE VISIBLE*/}
                <TopPane/>

                <div className="p-4">
                    <Routes>
                        <Route path="/" element={<ProductList/>}/>
                        <Route path="/order-history" element={<OrderHistory/>}/>
                        <Route path="/product/:id" element={<ProductDetail/>}/>
                    </Routes>
                </div>
            </div>
            <div className="bg-blue-500 p-4">
                <h1 className="text-white">Testing TailwindCSS</h1>
            </div>
        </Router>
    );
};

export default App;