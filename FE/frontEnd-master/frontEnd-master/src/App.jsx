import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/Store';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import ProductList from './components/Product/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import ChangePassword from './components/ChangePassword/ChangePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassWithCode from './components/ChangePassword/ChangPassWithCode';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import {ToastProvider, useToast} from './Toast/ToastContext';
import OrderTable from './components/Order/OrderTable';
import HomeAdmin from './components/Admin/HomeAdmin/HomeAdmin';
import AdminLayout from './AdminLayout';
import Payment from './components/Payment/Payment';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

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
        element: <Layout />,
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
            <I18nextProvider i18n={i18n}>
                <ToastProvider>
                    <div className="App">
                        <RouterProvider router={router} />
                    </div>
                </ToastProvider>
            </I18nextProvider>
        </Provider>
    );
}


export default App;