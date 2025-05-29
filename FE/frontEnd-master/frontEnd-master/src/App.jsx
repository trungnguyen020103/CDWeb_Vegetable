import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/Store';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
// import AboutUs from './components/AboutUs/AboutUs';
import Home from './components/Home/Home';
import ProductList from './components/Product/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
// import ShoppingCart from './components/ShoppingCart/ShoppingCart';
// import Contact from './components/Contact/Contact';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ChangePassWithCode from "./components/ChangePassword/ChangPassWithCode";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
// import ChangePassword from './components/ChangePassword/ChangePassword';
// import Profile from './components/Profile/Profile';
// import SearchResults from './components/SearchResults/SearchResults';
import Payment from "./components/Payment/Payment";
import { ToastProvider } from './Toast/ToastContext';
import OrderTable from "./components/Order/OrderTable";
import HomeAdmin from "./components/Admin/HomeAdmin/HomeAdmin";
import AdminLayout from "./AdminLayout";

const Layout = () => {
    console.log('Rendering Layout');
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />, // layout có Header + Footer
        children: [
            { index: true, element: <Home /> },
            { path: 'home', element: <Home /> },
            { path: 'product', element: <ProductList /> },
            { path: 'product/:id', element: <ProductDetail /> },
            { path: 'shoppingCart', element: <ShoppingCart /> },
            { path: 'register', element: <Register /> },
            { path: 'login', element: <Login /> },
            { path: 'changePassword', element: <ChangePassword /> },
            { path: 'forgotPassword', element: <ForgotPassword /> },
            { path: 'changewithcode', element: <ChangePassWithCode /> },
            { path: 'profile', element: <Profile /> },
            { path: 'order', element: <OrderTable /> },
            { path: 'payment', element: <Payment /> },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { path: 'home', element: <HomeAdmin /> },
        ],
    },
]);
function App() {
    return (
        <Provider store={store}>
            <ToastProvider>
                <div className="App">
                    <RouterProvider router={router} />
                </div>
            </ToastProvider>
        </Provider>
    );
}

export default App;
