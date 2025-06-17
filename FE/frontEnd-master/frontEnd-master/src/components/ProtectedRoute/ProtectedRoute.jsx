import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const role = localStorage.getItem('role');

    // Nếu không có role chuyển hướng về login
    if (!role) {
        return <Navigate to="/login" />;
    }

    // Nếu role hợp lệ  render Outlet (component con)
    if (allowedRoles.includes(parseInt(role))) {
        return <Outlet />;
    }

    // Nếu không có quyền  chuyển hướng đến trang unauthorized
    return <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
