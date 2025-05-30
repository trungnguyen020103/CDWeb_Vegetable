import React, { useCallback, useEffect, useState } from 'react';
import './OrderTable.css';
import axios from 'axios';

const OrderTable = () => {
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('accessToken');
    const [orders, setOrders] = useState([]); // Initialize as empty array
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    // State for details modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!idUser || !token) {
            setError('Vui lòng đăng nhập để xem đơn hàng.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/order/get/user/${idUser}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const mappedOrders = response.data.map((order) => ({
                id: order.id,
                orderDate: order.orderdate,
                productName: order.orderDetails?.[0]?.product?.name || 'Sản phẩm không xác định',
                quantity: order.orderDetails?.reduce((sum, detail) => sum + detail.quantity, 0) || 1,
                price: order.orderDetails?.[0]?.unitprice || order.total,
                status: getStatusText(Number(order.status)),
                shippingAddress: order.shippingaddress,
                note: order.note,
                paymentMethod: order.paymentmethod,
                total: order.total,
                orderDetails: order.orderDetails || [],
            }));
            setOrders(mappedOrders);
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
            setError('Không thể tải đơn hàng. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [idUser, token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'badge-warning';
            case 'Đang chuẩn bị giao':
                return 'badge-info';
            case 'Đang giao':
                return 'badge-info';
            case 'Đã giao':
                return 'badge-success';
            case 'Đã hủy':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'fa-clock-o';
            case 'Đang chuẩn bị giao':
                return 'fa-hourglass-start';
            case 'Đang giao':
                return 'fa-truck';
            case 'Đã giao':
                return 'fa-check-circle';
            case 'Đã hủy':
                return 'fa-times-circle';
            default:
                return 'fa-question-circle';
        }
    };

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

    const handleCancelOrder = (orderId) => {
        setOrderToCancel(orderId);
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        if (orderToCancel) {
            try {
                await axios.put(
                    `http://localhost:8080/api/order/update/${orderToCancel}?status=4`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setOrders(
                    orders.map((order) =>
                        order.id === orderToCancel ? { ...order, status: 'Đã hủy' } : order
                    )
                );
            } catch (error) {
                console.error('Lỗi khi hủy đơn hàng:', error);
                alert('Không thể hủy đơn hàng. Vui lòng thử lại.');
            }
        }
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOrder(null);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="order-container">
            <div className="order-card">
                <div className="card-header">
                    <h3 className="card-title">
                        <i className="fa fa-list-alt mr-3"></i>
                        Lịch Sử Đơn Hàng
                    </h3>
                    <div className="card-actions">
                        <button className="btn btn-outline-light btn-sm" onClick={fetchOrders}>
                            <i className="fa fa-refresh mr-1"></i>Làm mới
                        </button>
                        <button className="btn btn-outline-light btn-sm">
                            <i className="fa fa-filter mr-1"></i>Lọc
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table custom-table">
                        <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Ngày Đặt</th>
                            <th>Địa chỉ</th>
                            <th>Ghi chú</th>
                            <th>Phương thức thanh toán</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    {error}
                                </td>
                            </tr>
                        ) : currentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    Bạn chưa có đơn hàng nào.
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <strong className="order-id">{order.id}</strong>
                                    </td>
                                    <td>
                                        <span className="order-date">{formatDate(order.orderDate)}</span>
                                    </td>
                                    <td>
                                        <div className="product-info">
                                            <small className="text-muted">{order.shippingAddress}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="note">{order.note}</span>
                                    </td>
                                    <td>
                                        <span className="payment-method">{order.paymentMethod}</span>
                                    </td>
                                    <td>
                                        <span className="total-text">{formatCurrency(order.total)}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                            <i className={`fa ${getStatusIcon(order.status)} mr-1`}></i>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-outline-info mr-1"
                                                title="Xem chi tiết"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <i className="fa fa-eye"></i>
                                            </button>
                                            {order.status === 'Đang xử lý' && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Hủy đơn hàng"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                >
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <nav className="pagination-nav">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage - 1)} className="page-link">
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li
                                key={i + 1}
                                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                <button onClick={() => paginate(i + 1)} className="page-link">
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage + 1)} className="page-link">
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="order-footer">
                    <div className="footer-actions">
                        <button className="btn btn-primary btn-sm">
                            <i className="fa fa-plus mr-1"></i>Đặt Hàng Mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>Cảnh Báo</h5>
                            <button className="modal-close-btn" onClick={closeCancelModal}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary btn-sm" onClick={closeCancelModal}>
                                Hủy
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={confirmCancelOrder}>
                                Xác Nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content modal-details-content">
                        <div className="modal-header">
                            <h5>Chi Tiết Đơn Hàng Số {selectedOrder.id}</h5>
                            <button className="modal-close-btn" onClick={closeDetailsModal}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h6>Danh Sách Sản Phẩm</h6>
                            <div className="table-responsive">
                                <table className="table custom-table">
                                    <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Hình ảnh</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Tổng</th>
                                        <th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrder.orderDetails.length > 0 ? (
                                        selectedOrder.orderDetails.map((detail) => (
                                            <tr key={detail.id}>
                                                <td>{detail.product?.name || 'Sản phẩm không xác định'}</td>
                                                <td>
                                                    <img
                                                        src={detail.product?.imageUrl || 'https://via.placeholder.com/50'}
                                                        alt={detail.product?.name || 'Sản phẩm'}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td>{detail.quantity}</td>
                                                <td>{formatCurrency(detail.unitprice)}</td>
                                                <td>{formatCurrency(detail.total)}</td>
                                                <td>
                                                    <a href={`/product/${detail.product?.id}`}>
                                                        <button
                                                            className="btn btn-sm btn-outline-info mr-1"
                                                            title="Xem sản phẩm"
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                    </a>
                                                    <a href={`/product/${detail.product?.id}`}>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            title="Đánh giá sản phẩm"
                                                        >
                                                            <i className="fa fa-star"></i>
                                                        </button>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Không có sản phẩm chi tiết
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary btn-sm" onClick={closeDetailsModal}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTable;