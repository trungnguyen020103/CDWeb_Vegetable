import React, { useState } from 'react';
import './HomeAdmin.css'; // Import the separate CSS file
import UserManagement from '../TableManagement/UserManagement';
import ProductManagement from '../TableManagement/ProductManagement';
import CategoryManagement from '../TableManagement/CategoryManagement';
import Dashboard from './Dashboard';
import CommentManagement from '../TableManagement/CommentManagement';
import ReviewManagement from "../TableManagement/ReviewManagement";
import OrderManagement from "../TableManagement/OrderManagement";

const HomeAdmin = () => {
    const [activeView, setActiveView] = useState('dashboard');

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    return (
        <div className="home-admin-container">
            {/* Header */}
            <header className="home-admin-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                <div className="home-admin-header-brand">
                    <h3 className="home-admin-header-title mb-0">Admin</h3>
                </div>
                <div className="home-admin-header-actions">
                    <span className="home-admin-user-info mr-3">Welcome, User</span>
                    <button className="home-admin-btn btn btn-primary">Logout</button>
                </div>
            </header>
            <div className="home-admin-content">
                <div className="home-admin-sidebar bg-white shadow" style={{ width: '250px', height: '100vh' }}>
                    <div className="home-admin-sidebar-content p-4">
                        <div className="home-admin-logo mb-5">
                            <h3 className="home-admin-logo-text text-primary font-weight-bold">Admin</h3>
                        </div>
                        <ul className="home-admin-nav nav flex-column">
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'dashboard' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('dashboard');
                                    }}
                                >
                                    <i className="fa fa-tachometer-alt mr-3"></i>
                                    Dashboard
                                </a>
                            </li>
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'users' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('users');
                                    }}
                                >
                                    <i className="fa fa-users mr-3"></i>
                                    User Management
                                </a>
                            </li>
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'orders' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('orders');
                                    }}
                                >
                                    <i className="fa fa-comments mr-3"></i>
                                    Order Management
                                </a>
                            </li>
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'products' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('products');
                                    }}
                                >
                                    <i className="fa fa-box mr-3"></i>
                                    Product Management
                                </a>
                            </li>
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'categories' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('categories');
                                    }}
                                >
                                    <i className="fa fa-tags mr-3"></i>
                                    Category Management
                                </a>
                            </li>
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'comments' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('comments');
                                    }}
                                >
                                    <i className="fa fa-comments mr-3"></i>
                                    Comment Management
                                </a>
                            </li>
                            <li className="home-admin-nav-item nav-item mb-2">
                                <a
                                    href="#"
                                    className={`home-admin-nav-link nav-link text-dark d-flex align-items-center ${activeView === 'review' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewChange('reviews');
                                    }}
                                >
                                    <i className="fa fa-comments mr-3"></i>
                                    Review Management
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="home-admin-main flex-grow-1 p-4 bg-light">
                    {activeView === 'dashboard' && <Dashboard />}
                    {activeView === 'users' && <UserManagement />}
                    {activeView === 'products' && <ProductManagement />}
                    {activeView === 'categories' && <CategoryManagement />}
                    {activeView === 'comments' && <CommentManagement />}
                    {activeView === 'reviews' && <ReviewManagement />}
                    {activeView === 'orders' && <OrderManagement />}
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;