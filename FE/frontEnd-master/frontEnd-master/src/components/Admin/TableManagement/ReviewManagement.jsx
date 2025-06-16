import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State cho modal xóa
    const [deleteReviewId, setDeleteReviewId] = useState(null); // ID của review cần xóa
    const dataTableInitialized = useRef(false);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/review/getall', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Lỗi khi fetch review:', error);
            }
        };

        fetchReviews();
    }, []);

    const handleDelete = (reviewId) => {
        setDeleteReviewId(reviewId); // Lưu ID review cần xóa
        setShowDeleteModal(true); // Hiển thị modal xác nhận
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/admin/review/delete/${deleteReviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReviews((prev) => prev.filter((item) => item.id !== deleteReviewId)); // Cập nhật danh sách
            setShowDeleteModal(false); // Đóng modal
            setDeleteReviewId(null); // Reset ID
        } catch (err) {
            console.error('Lỗi xóa review:', err);
            alert(err.response?.data || 'Không thể xóa review');
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false); // Đóng modal
        setDeleteReviewId(null); // Reset ID
    };


    useEffect(() => {
        if (reviews.length > 0 && !dataTableInitialized.current) {
            const script = document.createElement('script');
            script.innerHTML = `$(document).ready(function () { $('#reviewTable').DataTable(); });`;
            document.body.appendChild(script);
            dataTableInitialized.current = true;
        }
    }, [reviews]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Review Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="reviewTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Product ID</th>
                                <th>User ID</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reviews.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.productId}</td>
                                    <td>{item.userId}</td>
                                    <td>
                                        {item.rating}
                                    </td>
                                    <td>{item.comment}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            title="Xóa"
                                            onClick={() => handleDelete(item.id)}
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

            {/* Modal for Delete Confirmation */}
            {showDeleteModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseDeleteModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa review này?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseDeleteModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;