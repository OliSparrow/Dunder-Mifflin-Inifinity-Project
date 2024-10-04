import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderHistory from "./components/customer/OrderHistory";
import TopPane from "./components/TopPane";
import ApplicationFooter from "./components/ApplicationFooter";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import CustomerView from "./components/customer/CustomerView.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-base-200">
                {/*TOP PANE SHOULD ALWAYS BE VISIBLE*/}
                <TopPane/>

                <div className="p-4">
                    <Routes>
                        <Route path="/*" element={<CustomerView/>}/>
                        <Route path="/admin/*" element={<AdminDashboard />} />
                        <Route path="/order-history" element={<OrderHistory/>}/>

                    </Routes>
                </div>

                <ApplicationFooter />
            </div>
        </Router>
    );
};

export default App;