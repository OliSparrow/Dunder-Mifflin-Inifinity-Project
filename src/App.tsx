import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import OrderHistory from "./components/OrderHistory";
import TopPane from "./components/TopPane";


//Making it look very basic for now.
//Might design a better looking site through Figma, just want the basics to work first.
const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen">
                <TopPane />
                <div className="pt-24 px-4 w-full max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/cart" element={<OrderHistory />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;