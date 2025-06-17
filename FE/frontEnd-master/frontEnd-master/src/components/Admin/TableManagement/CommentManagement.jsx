import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {useToast} from "../../../Toast/ToastContext";
const CommentManagement = () => {
    const [comments, setComments] = useState([]);
    const dataTableInitialized = useRef(false);
    const token = localStorage.getItem('accessToken');
    const { showToast } = useToast();
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/comment/getall', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setComments(response.data);
            } catch (error) {
                console.error('Lỗi khi fetch comment:', error);
            }
        };

        fetchComments();
    }, []);
    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/admin/comment/delete/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            showToast('Xóa thành công', 'success');
            setComments(prev => prev.filter(item => item.id !== commentId));
        } catch (err) {
            showToast('Xóa không thành công', 'error');
            console.error("Lỗi xoá comment:", err);
            alert(err.response?.data || "Không thể xoá comment");
        }
    };
    const handleStatusChange = async (commentId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/admin/comment/update-status/${commentId}`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? { ...comment, status: newStatus } : comment
                )
            );
            showToast('Cập nhật thành công', 'success');
        } catch (error) {
            showToast('Cập nhật thất bại ', 'error');
            console.error('Lỗi cập nhật trạng thái:', error);
            alert("Không thể cập nhật trạng thái.");
        }
    };

    useEffect(() => {
        if (comments.length > 0 && !dataTableInitialized.current) {
            const script = document.createElement("script");
            script.innerHTML = `$(document).ready(function () { $('#commentTable').DataTable(); });`;
            document.body.appendChild(script);
            dataTableInitialized.current = true;
        }
    }, [comments]);

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
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comments.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.userFullname}</td>
                                    <td>{item.content}</td>
                                    <td>{item.createdAt}</td>
                                    <td>
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                            className="form-select form-select-sm"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="APPROVED">APPROVED</option>
                                            <option value="REJECTED">REJECTED</option>
                                        </select>
                                    </td>

                                    <td>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="btn btn-sm btn-danger"
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>

                                    </td>
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
