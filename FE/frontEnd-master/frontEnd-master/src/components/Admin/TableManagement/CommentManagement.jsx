import React, { useEffect } from 'react';

const CommentManagement = () => {
    const data = [
        { id: 1, user: 'John Doe', comment: 'Great product!', date: '2025-05-27' },
        { id: 2, user: 'Jane Smith', comment: 'Nice service.', date: '2025-05-26' },
        { id: 3, user: 'Sam Wilson', comment: 'Could be better.', date: '2025-05-25' },
    ];

    useEffect(() => {
        // Chờ DOM load xong rồi gọi DataTable
        const script = document.createElement("script");
        script.innerHTML = `$(document).ready(function () { $('#commentTable').DataTable(); });`;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Comment Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="commentTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Comment</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.user}</td>
                                    <td>{item.comment}</td>
                                    <td>{item.date}</td>
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

export default CommentManagement;