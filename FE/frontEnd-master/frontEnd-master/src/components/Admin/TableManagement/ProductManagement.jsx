import React, { useEffect } from 'react';

const ProductManagement = () => {
    const data = [
        { id: 1, name: 'Laptop', price: 999.99, stock: 50 },
        { id: 2, name: 'Smartphone', price: 699.99, stock: 100 },
        { id: 3, name: 'Headphones', price: 99.99, stock: 200 },
    ];

    useEffect(() => {
        // Chờ DOM load xong rồi gọi DataTable
        const script = document.createElement("script");
        script.innerHTML = `$(document).ready(function () { $('#productTable').DataTable(); });`;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Product Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="productTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price ($)</th>
                                <th>Stock</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.stock}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;