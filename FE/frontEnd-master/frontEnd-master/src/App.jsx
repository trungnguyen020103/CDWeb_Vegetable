// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next'; // Thêm import này
import i18n from './i18n'; // Thêm import này
import store from './store/Store';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import ProductList from './components/Product/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Register from './components/Register/Register';
import Login from './components/Login/Login';

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
            // { path: 'aboutus', element: <AboutUs /> },
            // { path: 'product', element: <Product /> },
            { path: 'product/:id', element: <ProductDetail /> },
            { path: 'register', element: <Register /> },
            { path: 'login', element: <Login /> },
            // { path: 'changePassword', element: <ChangePassword /> },
            // { path: 'forgotPassword', element: <ForgotPassword /> },
            // { path: 'changewithcode', element: <ChangePassWithCode /> },
            // { path: 'profile/:id', element: <Profile /> },
            // { path: 'profile', element: <Profile /> },
            // { path: 'search', element: <SearchResults /> },

            // { path: 'payment', element: <Payment/> },
        ],
    },
]);

function App() {
    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}> {/* Bao bọc ứng dụng bằng I18nextProvider */}
                <div className="App">
                    <RouterProvider router={router} />
                </div>
            </I18nextProvider>
        </Provider>
    );
}

export default App;