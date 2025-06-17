import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {useToast} from "../../../Toast/ToastContext";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteOrderId, setDeleteOrderId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const dataTableInitialized = useRef(false);
    const token = localStorage.getItem('accessToken');
    const { showToast } = useToast();
    // Hàm chuyển đổi status sang tiếng Việt
    const getStatusText = (status) => {
        switch (Number(status)) {
            case 0:
                return 'Đang xử lý';
            case 1:
                return 'Đang chuẩn bị giao';
            case 2:
                return 'Đang giao';
            case 3:
                return 'Đã giao';
            case 4:
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/order/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                showToast('Tải danh sách đơn hàng thất bại', 'error');
                console.error('Lỗi khi fetch đơn hàng:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = (orderId) => {
        setDeleteOrderId(orderId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/admin/order/delete/${deleteOrderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showToast('Xóa thành công', 'success');
            setOrders((prev) => prev.filter((item) => item.id !== deleteOrderId));
            setShowDeleteModal(false);
            setDeleteOrderId(null);
        } catch (err) {
            showToast('Xóa thất bại', 'error');
            console.error('Lỗi xóa đơn hàng:', err);
            alert(err.response?.data || 'Không thể xóa đơn hàng');
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteOrderId(null);
    };

    const handleViewDetails = (orderDetails) => {
        setSelectedOrderDetails(orderDetails);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOrderDetails([]);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8080/admin/order/status/${orderId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        status: newStatus,
                    },
                },
            );
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order,
                ),
            );
            showToast('Cập nhật thành công', 'success');
        } catch (error) {
            showToast('Cập nhật thất bại', 'error');
            console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
            alert('Không thể cập nhật trạng thái đơn hàng');
        }
    };

    useEffect(() => {
        if (orders.length > 0 && !dataTableInitialized.current) {
            const script = document.createElement('script');
            script.innerHTML = `$(document).ready(function () { $('#orderTable').DataTable(); });`;
            document.body.appendChild(script);
            dataTableInitialized.current = true;
        }
    }, [orders]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Order Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="orderTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Order Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment Method</th>
                                <th>Shipping Address</th>
                                <th>Note</th>
                                <th>Order Details</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{new Date(item.orderdate).toLocaleString('vi-VN')}</td>
                                    <td>
                                        {item.total.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </td>
                                    <td>
                                        {item.status === '3' ? (
                                            <span>{getStatusText(item.status)}</span>
                                        ) : (
                                            <select
                                                className="form-select form-select-sm"
                                                value={item.status}
                                                onChange={(e) =>
                                                    handleStatusChange(item.id, e.target.value)
                                                }
                                                disabled={item.status === '3'}
                                            >
                                                <option value="0">Đang xử lý</option>
                                                <option value="1">Đang chuẩn bị giao</option>
                                                <option value="2">Đang giao</option>
                                                <option value="3">Đã giao</option>
                                                <option value="4">Đã hủy</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>{item.paymentmethod}</td>
                                    <td>{item.shippingaddress}</td>
                                    <td>{item.note || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleViewDetails(item.orderDetails)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            title="Xóa"
                                            onClick={() => handleDelete(item.id)}
                                            disabled={item.status === '3'}
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
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
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
                                <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
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

            {/* Modal for Order Details */}
            {showDetailsModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" style={{ maxWidth: '90%', width: '1200px', margin: 'auto',marginTop:'100px' }} >
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết đơn hàng</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseDetailsModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <th>Sản phẩm</th>
                                            <th>Danh mục</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Tổng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedOrderDetails.map((detail) => (
                                            <tr key={detail.id}>
                                                <td>
                                                    <img
                                                        src={detail.product.imageUrl}
                                                        alt={detail.product.name}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </td>
                                                <td>{detail.product.name}</td>
                                                <td>{detail.product.category.name}</td>
                                                <td>{detail.quantity}</td>
                                                <td>
                                                    {detail.unitprice.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </td>
                                                <td>
                                                    {detail.total.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseDetailsModal}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;