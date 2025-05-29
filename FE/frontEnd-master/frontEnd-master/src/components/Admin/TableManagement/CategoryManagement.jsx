import React, { useEffect } from 'react';

const CategoryManagement = () => {
    const data = [
        { id: 1, name: 'Electronics', description: 'Devices and gadgets' },
        { id: 2, name: 'Clothing', description: 'Apparel and accessories' },
        { id: 3, name: 'Books', description: 'Literature and textbooks' },
    ];

    useEffect(() => {
        // Chờ DOM load xong rồi gọi DataTable
        const script = document.createElement("script");
        script.innerHTML = `$(document).ready(function () { $('#categoryTable').DataTable(); });`;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Category Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="categoryTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
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

export default CategoryManagement;