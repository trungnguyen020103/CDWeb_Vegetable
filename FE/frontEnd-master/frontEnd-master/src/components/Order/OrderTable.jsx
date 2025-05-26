import React, { useState } from 'react';
import './OrderTable.css';

const OrderTable = () => {
    // Dữ liệu mẫu cho đơn hàng của user
    const [orders, setOrders] = useState([
        {
            id: 'DH001',
            orderDate: '2024-05-20',
            productName: 'iPhone 14 Pro Max 256GB',
            quantity: 1,
            price: 25000000,
            status: 'Đang xử lý',
            shippingAddress: '123 Nguyễn Văn Linh, Q.7, TP.HCM'
        },
        {
            id: 'DH002',
            orderDate: '2024-05-18',
            productName: 'Samsung Galaxy S23 Ultra',
            quantity: 1,
            price: 22000000,
            status: 'Đã giao',
            shippingAddress: '456 Lê Văn Việt, Q.9, TP.HCM'
        },
        {
            id: 'DH003',
            orderDate: '2024-05-15',
            productName: 'MacBook Pro M2 14inch',
            quantity: 1,
            price: 45000000,
            status: 'Đang giao',
            shippingAddress: '789 Võ Văn Tần, Q.3, TP.HCM'
        },
        {
            id: 'DH004',
            orderDate: '2024-05-10',
            productName: 'iPad Air 5th Gen WiFi 64GB',
            quantity: 2,
            price: 15000000,
            status: 'Đã hủy',
            shippingAddress: '321 Cách Mạng Tháng 8, Q.10, TP.HCM'
        },
        {
            id: 'DH005',
            orderDate: '2024-05-05',
            productName: 'AirPods Pro Gen 2',
            quantity: 1,
            price: 6000000,
            status: 'Đã giao',
            shippingAddress: '654 Nguyễn Thị Minh Khai, Q.1, TP.HCM'
        }
    ]);

    // Hàm format tiền tệ VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Hàm format ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Hàm lấy class cho trạng thái
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'badge-warning';
            case 'Đã giao':
                return 'badge-success';
            case 'Đang giao':
                return 'badge-info';
            case 'Đã hủy':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    // Hàm lấy icon cho trạng thái
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'fa-clock-o';
            case 'Đã giao':
                return 'fa-check-circle';
            case 'Đang giao':
                return 'fa-truck';
            case 'Đã hủy':
                return 'fa-times-circle';
            default:
                return 'fa-question-circle';
        }
    };

    // Tính tổng tiền đã mua
    const calculateTotalSpent = () => {
        return orders
            .filter(order => order.status === 'Đã giao')
            .reduce((total, order) => total + (order.price * order.quantity), 0);
    };

    // Hàm xử lý hủy đơn hàng
    const handleCancelOrder = (orderId) => {
        const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?');
        if (confirmCancel) {
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'Đã hủy' } : order
            ));
        }
    };

    // Hàm xem chi tiết đơn hàng
    const handleViewDetails = (order) => {
        alert(`
Thông tin đơn hàng: ${order.id}
Ngày đặt: ${formatDate(order.orderDate)}
Sản phẩm: ${order.productName}
Số lượng: ${order.quantity}
Giá: ${formatCurrency(order.price)}
Tổng tiền: ${formatCurrency(order.price * order.quantity)}
Địa chỉ giao hàng: ${order.shippingAddress}
Trạng thái: ${order.status}
        `);
    };

    return (
        <>
            <div className="order-container">
                {/* Thống kê đơn hàng */}
                <div className="order-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fa fa-shopping-bag"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{orders.length}</div>
                            <div className="stat-label">Tổng đơn hàng</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success">
                            <i className="fa fa-check-circle"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{orders.filter(o => o.status === 'Đã giao').length}</div>
                            <div className="stat-label">Đã giao thành công</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon warning">
                            <i className="fa fa-clock-o"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{orders.filter(o => o.status === 'Đang xử lý').length}</div>
                            <div className="stat-label">Đang xử lý</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon info">
                            <i className="fa fa-money"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{formatCurrency(calculateTotalSpent())}</div>
                            <div className="stat-label">Tổng đã mua</div>
                        </div>
                    </div>
                </div>

                {/* Bảng đơn hàng */}
                <div className="order-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fa fa-list-alt mr-3"></i>
                            Lịch Sử Đơn Hàng
                        </h3>
                        <div className="card-actions">
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
                                <th>Sản Phẩm</th>
                                <th>SL</th>
                                <th>Đơn Giá</th>
                                <th>Tổng Tiền</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>
                                        <strong className="order-id">{order.id}</strong>
                                    </td>
                                    <td>
                                        <span className="order-date">{formatDate(order.orderDate)}</span>
                                    </td>
                                    <td>
                                        <div className="product-info">
                                            <div className="productname">{order.productName}</div>
                                            <small className="textmuted">{order.shippingAddress}</small>
                                        </div>
                                    </td>
                                    <td>
                                            <span className="quantity">
                                                {order.quantity}
                                            </span>
                                    </td>
                                    <td>
                                            <span className="price-text">
                                                {formatCurrency(order.price)}
                                            </span>
                                    </td>
                                    <td>
                                            <span className="total-text">
                                                {formatCurrency(order.price * order.quantity)}
                                            </span>
                                    </td>
                                    <td>
                                            <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                                <i className={`fa ${getStatusIcon(order.status)}`}></i>
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
                                            {order.status === 'Đã giao' && (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    title="Đánh giá sản phẩm"
                                                >
                                                    <i className="fa fa-star"></i>
                                                </button>
                                            )}
                                            {order.status === 'Đang giao' && (
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Theo dõi đơn hàng"
                                                >
                                                    <i className="fa fa-map-marker"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="order-footer">
                        <div className="footer-actions">
                            <button className="btn btn-primary btn-sm">
                                <i className="fa fa-plus mr-1"></i>Đặt Hàng Mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderTable;