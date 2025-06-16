import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="container mt-5 text-center">
            <h1 className="text-danger">403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <Link to="/product" className="btn btn-primary">Quay lại trang chủ</Link>
        </div>
    );
};

export default Unauthorized;
