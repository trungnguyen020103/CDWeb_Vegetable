import React, { useState } from 'react';
import Select from 'react-select';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../Toast/ToastContext';

const Payment = () => {
    const [shippingAddress, setShippingAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    // Lấy danh sách sản phẩm được chọn từ state
    const selectedProducts = location.state?.selectedProducts || [];

    // Tính tổng giá tiền dựa trên selectedProducts
    const totalPrice = selectedProducts.reduce((total, product) => {
        return total + (product.price || 0) * (product.quantity || 0);
    }, 0);

    // Đồng bộ key userId
    const userId = localStorage.getItem('idUser');

    // Nếu không có sản phẩm nào được chọn, chuyển hướng về giỏ hàng
    if (selectedProducts.length === 0) {
        showToast('Không có sản phẩm nào được chọn để thanh toán!', 'error');
        navigate('/cart');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            showToast('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!', 'error');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu không tìm thấy ID người dùng
            return;
        }

        if (!shippingAddress) {
            showToast('Vui lòng nhập địa chỉ giao hàng!', 'error');
            return;
        }

        if (selectedProducts.length === 0) {
            showToast('Không có sản phẩm nào để thanh toán!', 'error');
            return;
        }

        setIsLoading(true);

        const orderData = {
            orderdate: new Date().toISOString(),
            total: totalPrice,
            status: '0',
            paymentmethod: paymentMethod,
            shippingaddress: shippingAddress,
            note: note || '',
            orderDetails: selectedProducts.map((item) => ({
                product: { id: item.id },
                quantity: item.quantity,
            })),
        };

        try {
            if (paymentMethod === 'COD') {
                const response = await axios.post(
                    `http://localhost:8080/api/order/add/user/${userId}`,
                    orderData,
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                if (response.status === 200 && response.data) {
                    showToast('Đặt hàng thành công!', 'success');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    throw new Error('Phản hồi từ API không hợp lệ');
                }
            } else if (paymentMethod === 'PAYPAL') {
                const response = await axios.post(
                    `http://localhost:8080/api/order/paypal/create-payment`,
                    orderData,
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const approvalUrl = response.data?.approvalUrl;
                if (approvalUrl) {
                    showToast('Đang chuyển hướng đến PayPal...', 'info');
                    window.location.href = approvalUrl;
                } else {
                    throw new Error('Không nhận được URL xác nhận từ PayPal');
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi đơn hàng:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Không thể gửi đơn hàng. Vui lòng thử lại!';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Header Cart Section */}
            <div className="wrap-header-cart js-panel-cart">
                <div className="s-full js-hide-cart"></div>
                <div className="header-cart flex-col-l p-l-65 p-r-25">
                    <div className="header-cart-title flex-w flex-sb-m p-b-8">
                        <span className="mtext-103 cl2">Giỏ hàng của bạn</span>
                        <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
                            <i className="zmdi zmdi-close"></i>
                        </div>
                    </div>
                    <div className="header-cart-content flex-w js-pscroll">
                        <ul className="header-cart-wrapitem w-full">
                            {selectedProducts.length === 0 ? (
                                <li className="header-cart-item flex-w flex-t m-b-12">
                                    <span>Không có sản phẩm nào được chọn</span>
                                </li>
                            ) : (
                                selectedProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        className="header-cart-item flex-w flex-t m-b-12"
                                    >
                                        <div className="header-cart-item-img">
                                            <img
                                                src={product.imageUrl || '/images/placeholder.jpg'}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className="header-cart-item-txt p-t-8">
                                            <a
                                                href="#"
                                                className="header-cart-item-name m-b-18 hov-cl1 trans-04"
                                            >
                                                {product.name || 'Sản phẩm không xác định'}
                                            </a>
                                            <span className="header-cart-item-info">
                        {product.quantity} x {(product.price || 0).toLocaleString()} VNĐ
                      </span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                        <div className="w-full">
                            <div className="header-cart-total w-full p-tb-40">
                                Tổng cộng: {totalPrice.toLocaleString()} VNĐ
                            </div>
                            <div className="header-cart-buttons flex-w w-full">
                                <Link
                                    to="/cart"
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
                                >
                                    Xem giỏ hàng
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => document.querySelector('form').requestSubmit()}
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                    <Link to="/" className="stext-109 cl8 hov-cl1 trans-04">
                        Trang chủ
                        <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                    </Link>
                    <span className="stext-109 cl4">Thanh toán</span>
                </div>
            </div>

            <form className="bg0 p-t-75 p-b-85" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
                            <div className="m-l-25 m-r--38 m-lr-0-xl">
                                <div className="wrap-table-shopping-cart">
                                    <table className="table-shopping-cart">
                                        <thead>
                                        <tr className="table_head">
                                            <th className="column-1">Sản phẩm</th>
                                            <th className="column-2">Tên</th>
                                            <th className="column-3">Giá</th>
                                            <th className="column-4">Số lượng</th>
                                            <th className="column-5">Tổng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    Không có sản phẩm nào được chọn
                                                </td>
                                            </tr>
                                        ) : (
                                            selectedProducts.map((product) => (
                                                <tr key={product.id} className="table_row">
                                                    <td className="column-1">
                                                        <div className="how-itemcart1">
                                                            <img
                                                                src={product.imageUrl || '/images/placeholder.jpg'}
                                                                alt={product.name}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="column-2">
                                                        {product.name || 'Sản phẩm không xác định'}
                                                    </td>
                                                    <td className="column-3">
                                                        {(product.price || 0).toLocaleString()} VNĐ
                                                    </td>
                                                    <td className="column-4">{product.quantity}</td>
                                                    <td className="column-5">
                                                        {((product.price || 0) * (product.quantity || 0)).toLocaleString()}{' '}
                                                        VNĐ
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                                    <div className="flex-w flex-m m-r-20 m-tb-5">
                                        <input
                                            className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
                                            type="text"
                                            name="coupon"
                                            placeholder="Mã giảm giá"
                                        />
                                        <div className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
                                            Áp dụng
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                                <h4 className="mtext-109 cl2 p-b-30">Tổng giỏ hàng</h4>

                                <div className="flex-w flex-t bor12 p-b-13">
                                    <div className="size-208">
                                        <span className="stext-110 cl2">Tạm tính:</span>
                                    </div>
                                    <div className="size-209">
                                        <span className="mtext-110 cl2">{totalPrice.toLocaleString()} VNĐ</span>
                                    </div>
                                </div>

                                <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                                    <div className="size-208 w-full-ssm">
                                        <span className="stext-110 cl2">Giao hàng:</span>
                                    </div>
                                    <div className="size-209 p-r-18 p-r-0-sm w-full-ssm">
                                        <p className="stext-111 cl6 p-t-2">Vui lòng cung cấp thông tin</p>
                                        <div className="p-t-15">
                                            <div className="bor8 bg0 m-b-12">
                                                <input
                                                    className="stext-111 cl8 plh3 size-111 p-lr-15"
                                                    type="text"
                                                    name="shippingAddress"
                                                    placeholder="Địa chỉ giao hàng (ví dụ: Đắc Lắc)"
                                                    value={shippingAddress}
                                                    onChange={(e) => setShippingAddress(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="bor8 bg0 m-b-22">
                                                <input
                                                    className="stext-111 cl8 plh3 size-111 p-lr-15"
                                                    type="text"
                                                    name="note"
                                                    placeholder="Ghi chú (ví dụ: Giao tối)"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                />
                                            </div>
                                            {/*<div className="rs1-select2 rs2-select2 bor8 bg0 m-b-12">*/}
                                            {/*    <Select*/}
                                            {/*        value={paymentOptions.find(*/}
                                            {/*            (option) => option.value === paymentMethod*/}
                                            {/*        )}*/}
                                            {/*        onChange={(selected) =>*/}
                                            {/*            setPaymentMethod(selected?.value || 'COD')*/}
                                            {/*        }*/}
                                            {/*        options={paymentOptions}*/}
                                            {/*        placeholder="Chọn phương thức thanh toán..."*/}
                                            {/*        classNamePrefix="react-select"*/}
                                            {/*        required*/}
                                            {/*    />*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-w flex-t p-t-27 p-b-33">
                                    <div className="size-208">
                                        <span className="mtext-101 cl2">Tổng cộng:</span>
                                    </div>
                                    <div className="size-209 p-t-1">
                                        <span className="mtext-110 cl2">{totalPrice.toLocaleString()} VNĐ</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Tiến hành đặt hàng'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div className="btn-back-to-top" id="myBtn">
                <span className="symbol-btn-back-to-top">
                    <i className="zmdi zmdi-chevron-up"></i>
                </span>
            </div>
        </div>
    );
};

export default Payment;