import React, { useCallback, useEffect, useState } from 'react';
import './OrderTable.css';
import axios from 'axios';
import { useToast } from "../../Toast/ToastContext";
import { useTranslation } from 'react-i18next';

const OrderTable = () => {
    const { t } = useTranslation();
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('accessToken');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showToast } = useToast();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        productId: null,
        rating: 5,
        comment: '',
    });

    const fetchOrders = useCallback(async () => {
        if (!idUser || !token) {
            setError(t('please_login'));
            showToast(t('please_login'), 'error');
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
                productName: order.orderDetails?.[0]?.product?.name || t('undefined_product'),
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
            showToast(t('error_loading'), 'error');
            console.error('Error fetching orders:', error);
            setError(t('error_loading'));
        } finally {
            setIsLoading(false);
        }
    }, [idUser, token, t, showToast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

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
            case t('status_processing'):
                return 'badge-warning';
            case t('status_preparing'):
                return 'badge-info';
            case t('status_shipping'):
                return 'badge-info';
            case t('status_delivered'):
                return 'badge-success';
            case t('status_canceled'):
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case t('status_processing'):
                return 'fa-clock-o';
            case t('status_preparing'):
                return 'fa-hourglass-start';
            case t('status_shipping'):
                return 'fa-truck';
            case t('status_delivered'):
                return 'fa-check-circle';
            case t('status_canceled'):
                return 'fa-times-circle';
            default:
                return 'fa-question-circle';
        }
    };

    const getStatusText = (status) => {
        switch (Number(status)) {
            case 0:
                return t('status_processing');
            case 1:
                return t('status_preparing');
            case 2:
                return t('status_shipping');
            case 3:
                return t('status_delivered');
            case 4:
                return t('status_canceled');
            default:
                return t('status_unknown');
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
                        order.id === orderToCancel ? { ...order, status: t('status_canceled') } : order
                    )
                );
                showToast(t('cancel_order_success'), 'success');
            } catch (error) {
                console.error('Error canceling order:', error);
                showToast(t('cancel_order_failed'), 'error');
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

    const handleReviewProduct = (productId) => {
        setReviewData({
            productId: productId,
            rating: 5,
            comment: '',
        });
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewData({
            productId: null,
            rating: 5,
            comment: '',
        });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewDto = {
                productId: reviewData.productId,
                userId: parseInt(idUser),
                rating: parseInt(reviewData.rating),
                comment: reviewData.comment,
                date: new Date().toISOString(),
            };
            await axios.post(
                'http://localhost:8080/user/review/create',
                reviewDto,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            showToast(t('review_success'), 'success');
            closeReviewModal();
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast(t('review_failed'), 'error');
        }
    };

    const handleReviewInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    };

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

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
                        {t('order_history')}
                    </h3>
                    <div className="card-actions">
                        <button className="btn btn-outline-light btn-sm" onClick={fetchOrders}>
                            <i className="fa fa-refresh mr-1"></i>{t('refresh')}
                        </button>
                        <button className="btn btn-outline-light btn-sm">
                            <i className="fa fa-filter mr-1"></i>{t('filter')}
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table custom-table">
                        <thead>
                        <tr>
                            <th>{t('order_id')}</th>
                            <th>{t('order_date')}</th>
                            <th>{t('shipping_address')}</th>
                            <th>{t('note')}</th>
                            <th>{t('payment_method')}</th>
                            <th>{t('total')}</th>
                            <th>{t('status')}</th>
                            <th>{t('action')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    {t('loading')}
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
                                    {t('no_orders')}
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
                                                title={t('view_details')}
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <i className="fa fa-eye"></i>
                                            </button>
                                            {order.status === t('status_processing') && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger mr-1"
                                                    title={t('cancel_order')}
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
                                {t('previous')}
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
                                {t('next')}
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="order-footer">
                    <div className="footer-actions">
                        <button className="btn btn-primary btn-sm">
                            <i className="fa fa-plus mr-1"></i>{t('new_order')}
                        </button>
                    </div>
                </div>

                {showCancelModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{t('warning')}</h5>
                                <button className="modal-close-btn" onClick={closeCancelModal}>
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{t('confirm_cancel')}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={closeCancelModal}>
                                    {t('cancel')}
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={confirmCancelOrder}>
                                    {t('confirm')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDetailsModal && selectedOrder && (
                    <div className="modal-overlay">
                        <div className="modal-content modal-details-content">
                            <div className="modal-header">
                                <h5>{t('order_details')} {selectedOrder.id}</h5>
                                <button className="modal-close-btn" onClick={closeDetailsModal}>
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6>{t('product_list')}</h6>
                                <div className="table-responsive">
                                    <table className="table custom-table">
                                        <thead>
                                        <tr>
                                            <th>{t('product')}</th>
                                            <th>{t('image')}</th>
                                            <th>{t('quantity')}</th>
                                            <th>{t('unit_price')}</th>
                                            <th>{t('total')}</th>
                                            <th>{t('action')}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedOrder.orderDetails.length > 0 ? (
                                            selectedOrder.orderDetails.map((detail) => (
                                                <tr key={detail.id}>
                                                    <td>{detail.product?.name || t('undefined_product')}</td>
                                                    <td>
                                                        <img
                                                            src={
                                                                detail.product?.imageUrl ||
                                                                'https://via.placeholder.com/50'
                                                            }
                                                            alt={detail.product?.name || t('product')}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{detail.quantity}</td>
                                                    <td>{formatCurrency(detail.unitprice)}</td>
                                                    <td>{formatCurrency(detail.quantity * detail.unitprice)}</td>
                                                    <td>
                                                        <a href={`/product/${detail.product?.id}`}>
                                                            <button
                                                                className="btn btn-sm btn-outline-info mr-1"
                                                                title={t('view_product')}
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                        </a>
                                                        {selectedOrder.status === t('status_delivered') && (
                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                title={t('review_product')}
                                                                onClick={() => handleReviewProduct(detail.product?.id)}
                                                            >
                                                                <i className="fa fa-star"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    {t('no_order_details')}
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={closeDetailsModal}>
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showReviewModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{t('review_product')}</h5>
                                <button className="modal-close-btn" onClick={closeReviewModal}>
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="rating">{t('rating')}</label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '1.5rem',
                                                        color: star <= reviewData.rating ? '#ffc107' : '#e4e5e9',
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment">{t('comment')}</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            value={reviewData.comment}
                                            onChange={handleReviewInputChange}
                                            className="form-control"
                                            rows="4"
                                            placeholder={t('nhập đánh giá')}
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={closeReviewModal}
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button type="submit" className="btn btn-primary btn-sm">
                                            {t('submit_review')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTable;