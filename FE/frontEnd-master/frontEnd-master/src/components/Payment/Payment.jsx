import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../Toast/ToastContext';
import { useTranslation } from 'react-i18next';

const Payment = () => {
    const { t } = useTranslation();
    const [shippingAddress, setShippingAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [hasRedirected, setHasRedirected] = useState(false);

    const selectedProducts = location.state?.selectedProducts || [];

    const totalPrice = selectedProducts.reduce((total, product) => {
        return total + (product.price || 0) * (product.quantity || 0);
    }, 0);

    const userId = localStorage.getItem('idUser');

    useEffect(() => {
        if (selectedProducts.length === 0 && !hasRedirected) {
            showToast(t('no_products_selected'), 'error');
            setHasRedirected(true);
            navigate('/cart');
        }
    }, [selectedProducts, hasRedirected, navigate, showToast, t]);

    if (hasRedirected) {
        return null;
    }

    const paymentOptions = [
        { value: 'COD', label: t('payment_methods.cod') },
        { value: 'PAYPAL', label: t('payment_methods.paypal') },
        { value: 'VNPAY', label: t('payment_methods.vnpay') },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            showToast(t('please_login'), 'error');
            navigate('/login');
            return;
        }

        if (!shippingAddress.trim()) {
            showToast(t('enter_shipping_address'), 'error');
            return;
        }

        if (selectedProducts.length === 0) {
            showToast(t('no_products_to_pay'), 'error');
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

        console.log('Sending order data to backend:', orderData);

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
                    showToast(t('order_success'), 'success');
                    setTimeout(() => {
                        navigate('/order');
                    }, 2000);
                } else {
                    throw new Error(t('invalid_api_response'));
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
                    showToast(t('redirecting_paypal'), 'info');
                    window.location.href = approvalUrl;
                } else {
                    throw new Error(t('paypal_url_error'));
                }
            } else if (paymentMethod === 'VNPAY') {
                const response = await axios.post(
                    `http://localhost:8080/api/payment/vnpay/create-payment?userId=${userId}`,
                    orderData,
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                console.log('Received response from VNPay create-payment:', response.data);
                const paymentUrl = response.data?.paymentUrl;
                if (paymentUrl) {
                    showToast(t('redirecting_vnpay'), 'info');
                    window.location.href = paymentUrl;
                } else {
                    throw new Error(t('vnpay_url_error'));
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                t('order_error');
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="wrap-header-cart js-panel-cart">
                <div className="s-full js-hide-cart"></div>
                <div className="header-cart flex-col-l p-l-65 p-r-25">
                    <div className="header-cart-title flex-w flex-sb-m p-b-8">
                        <span className="mtext-103 cl2">{t('your_cart')}</span>
                        <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
                            <i className="zmdi zmdi-close"></i>
                        </div>
                    </div>
                    <div className="header-cart-content flex-w js-pscroll">
                        <ul className="header-cart-wrapitem w-full">
                            {selectedProducts.length === 0 ? (
                                <li className="header-cart-item flex-w flex-t m-b-12">
                                    <span>{t('no_products_in_cart')}</span>
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
                                                {product.name || t('undefined_product')}
                                            </a>
                                            <span className="header-cart-item-info">
                                                {product.quantity} x {(product.price || 0).toLocaleString('vi-VN')} {t('currency')}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                        <div className="w-full">
                            <div className="header-cart-total w-full p-tb-40">
                                {t('total')}: {totalPrice.toLocaleString('vi-VN')} {t('currency')}
                            </div>
                            <div className="header-cart-buttons flex-w w-full">
                                <Link
                                    to="/shoppingCart"
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
                                >
                                    {t('view_cart')}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => document.querySelector('form').requestSubmit()}
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('processing') : t('checkout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                    <Link to="/" className="stext-109 cl8 hov-cl1 trans-04">
                        {t('home_page')}
                        <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                    </Link>
                    <span className="stext-109 cl4">{t('checkout')}</span>
                </div>
            </div>

            <form className="bg0 p-t-75 p-b-85" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
                            <div className="m-l-25 m-r-38 m-lr-0-xl">
                                <div className="wrap-table-shopping-cart">
                                    <table className="table-shopping-cart">
                                        <thead>
                                        <tr className="table_head">
                                            <th className="column-1">{t('product')}</th>
                                            <th className="column-2">{t('name')}</th>
                                            <th className="column-3">{t('price')}</th>
                                            <th className="column-4">{t('quantity_short')}</th>
                                            <th className="column-5">{t('total_amount')}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    {t('no_products_selected')}
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
                                                        {product.name || t('undefined_product')}
                                                    </td>
                                                    <td className="column-3">
                                                        {(product.price || 0).toLocaleString('vi-VN')} {t('currency')}
                                                    </td>
                                                    <td className="column-4">{product.quantity}</td>
                                                    <td className="column-5">
                                                        {((product.price || 0) * (product.quantity || 0)).toLocaleString('vi-VN')} {t('currency')}
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
                                            placeholder={t('coupon_code')}
                                        />
                                        <div className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
                                            {t('apply')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                                <h4 className="mtext-109 cl2 p-b-30">{t('cart_total')}</h4>

                                <div className="flex-w flex-t bor12 p-b-13">
                                    <div className="size-208">
                                        <span className="stext-110 cl2">{t('subtotal')}</span>
                                    </div>
                                    <div className="size-209">
                                        <span className="mtext-110 cl2">{totalPrice.toLocaleString('vi-VN')} {t('currency')}</span>
                                    </div>
                                </div>

                                <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                                    <div className="size-208 w-full-ssm">
                                        <span className="stext-110 cl2">{t('delivery')}</span>
                                    </div>
                                    <div className="size-209 p-r-18 p-r-0-sm w-full-ssm">
                                        <p className="stext-111 cl6 p-t-2">{t('provide_info')}</p>
                                        <div className="p-t-15">
                                            <div className="bor8 bg0 m-b-12">
                                                <input
                                                    className="stext-111 cl8 plh3 size-111 p-lr-15"
                                                    type="text"
                                                    name="shippingAddress"
                                                    placeholder={t('shipping_address')}
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
                                                    placeholder={t('note_placeholder')}
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                />
                                            </div>
                                            <div className="rs1-select2 rs2-select2 bor8 bg0 m-b-12">
                                                <Select
                                                    value={paymentOptions.find(
                                                        (option) => option.value === paymentMethod
                                                    )}
                                                    onChange={(selected) =>
                                                        setPaymentMethod(selected?.value || 'COD')
                                                    }
                                                    options={paymentOptions}
                                                    placeholder={t('select_payment_method')}
                                                    classNamePrefix="react-select"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-w flex-t p-t-27 p-b-33">
                                    <div className="size-208">
                                        <span className="mtext-101 cl2">{t('total')}</span>
                                    </div>
                                    <div className="size-209 p-t-1">
                                        <span className="mtext-110 cl2">{totalPrice.toLocaleString('vi-VN')} {t('currency')}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('processing') : t('place_order')}
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