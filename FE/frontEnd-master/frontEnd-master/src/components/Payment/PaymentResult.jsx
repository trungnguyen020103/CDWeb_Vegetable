import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '../../Toast/ToastContext';
import { useTranslation } from 'react-i18next';

const PaymentResult = () => {
    const { t } = useTranslation();
    const [paymentResult, setPaymentResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { showToast } = useToast();
    const hasShownToast = useRef(false);

    useEffect(() => {
        const fetchPaymentResult = () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const params = {};
                queryParams.forEach((value, key) => {
                    params[key] = value;
                });

                if (params.error) {
                    setPaymentResult({ message: params.error, status: "failed" });
                    if (!hasShownToast.current) {
                        showToast(params.error, 'error');
                        hasShownToast.current = true;
                    }
                } else {
                    const result = {
                        status: params.vnp_ResponseCode === "00" ? "success" : "failed",
                        message: params.vnp_ResponseCode === "00" ? t('payment_success') : t('payment_failed'),
                        amount: params.vnp_Amount,
                        orderId: params.vnp_TxnRef,
                        transactionNo: params.vnp_TransactionNo,
                        payDate: params.vnp_PayDate,
                        bankCode: params.vnp_BankCode,
                        orderInfo: params.vnp_OrderInfo,
                    };
                    setPaymentResult(result);
                    if (!hasShownToast.current) {
                        showToast(result.message, result.status === "success" ? 'success' : 'error');
                        hasShownToast.current = true;
                    }
                }
            } catch (error) {
                console.error('Error processing payment result:', error);
                if (!hasShownToast.current) {
                    showToast(t('payment_processing_error'), 'error');
                    hasShownToast.current = true;
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentResult();
    }, [location, showToast, t]);

    if (loading) {
        return (
            <div className="container text-center p-t-75 p-b-85">
                <h4 className="mtext-109 cl2 p-b-30">{t('loading_payment_result')}</h4>
            </div>
        );
    }

    if (!paymentResult) {
        return (
            <div className="container text-center p-t-75 p-b-85">
                <h4 className="mtext-109 cl2 p-b-30">{t('payment_info_not_found')}</h4>
                <Link to="/" className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer">
                    {t('back_to_home')}
                </Link>
            </div>
        );
    }

    const { status, message, amount, orderId, transactionNo, payDate, bankCode, orderInfo } = paymentResult;

    const formattedAmount = amount ? (parseInt(amount) / 100).toLocaleString('vi-VN') + ' VNĐ' : t('N/A');

    const formattedPayDate = payDate
        ? new Date(
            parseInt(payDate.substring(0, 4)),
            parseInt(payDate.substring(4, 6)) - 1,
            parseInt(payDate.substring(6, 8)),
            parseInt(payDate.substring(8, 10)),
            parseInt(payDate.substring(10, 12)),
            parseInt(payDate.substring(12, 14))
        ).toLocaleString('vi-VN')
        : t('N/A');

    return (
        <div className="container p-t-75 p-b-85">
            <div className="row">
                <div className="col-lg-8 m-lr-auto m-b-50">
                    <div className="bor10 p-lr-40 p-t-30 p-b-40 m-lr-0-xl p-lr-15-sm" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                        <h4 className="mtext-109 cl2 p-b-30 text-center" style={{ color: status === 'success' ? '#28a745' : '#dc3545', fontSize: '28px' }}>
                            {status === 'success' ? t('payment_success') : t('payment_failed')}
                        </h4>
                        <div className="p-b-20 text-center">
                            <span className="stext-110 cl2" style={{ fontSize: '18px', color: '#555' }}>{message}</span>
                        </div>
                        <div className="p-t-15">
                            <div className="flex-w flex-t p-b-15" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div className="size-208">
                                    <span className="stext-110 cl2" style={{ fontWeight: '500', color: '#333' }}>{t('order_info')}</span>
                                </div>
                                <div className="size-209">
                                    <span className="stext-110 cl2" style={{ fontWeight: '600', color: '#666' }}>{orderInfo || t('N/A')}</span>
                                </div>
                            </div>
                            <div className="flex-w flex-t p-b-15" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div className="size-208">
                                    <span className="stext-110 cl2" style={{ fontWeight: '500', color: '#333' }}>{t('total')}</span>
                                </div>
                                <div className="size-209">
                                    <span className="mtext-110 cl2" style={{ fontWeight: '600', color: '#e74c3c' }}>{formattedAmount}</span>
                                </div>
                            </div>
                            <div className="flex-w flex-t p-b-15" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div className="size-208">
                                    <span className="stext-110 cl2" style={{ fontWeight: '500', color: '#333' }}>{t('order_id')}</span>
                                </div>
                                <div className="size-209">
                                    <span className="stext-110 cl2" style={{ fontWeight: '600', color: '#666' }}>{orderId || t('N/A')}</span>
                                </div>
                            </div>
                            <div className="flex-w flex-t p-b-15" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div className="size-208">
                                    <span className="stext-110 cl2" style={{ fontWeight: '500', color: '#333' }}>{t('vnpay_transaction')}</span>
                                </div>
                                <div className="size-209">
                                    <span className="stext-110 cl2" style={{ fontWeight: '600', color: '#666' }}>{transactionNo || t('N/A')}</span>
                                </div>
                            </div>
                            <div className="flex-w flex-t p-b-15" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div className="size-208">
                                    <span className="stext-110 cl2" style={{ fontWeight: '500', color: '#333' }}>{t('payment_time')}</span>
                                </div>
                                <div className="size-209">
                                    <span className="stext-110 cl2" style={{ fontWeight: '600', color: '#666' }}>{formattedPayDate}</span>
                                </div>
                            </div>
                            <div className="flex-w flex-t p-b-15" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div className="size-208">
                                    <span className="stext-110 cl2" style={{ fontWeight: '500', color: '#333' }}>{t('bank')}</span>
                                </div>
                                <div className="size-209">
                                    <span className="stext-110 cl2" style={{ fontWeight: '600', color: '#666' }}>{bankCode || t('N/A')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-w flex-t p-t-27 p-b-33" style={{ justifyContent: 'center', gap: '20px' }}>
                            <Link
                                to="/order"
                                className="flex-c-m stext-101 size-116 p-lr-20 trans-04 pointer"
                                style={{
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    transition: 'background-color 0.3s ease',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
                            >
                                {t('view_order')}
                            </Link>
                            <Link
                                to="/"
                                className="flex-c-m stext-101 size-116 p-lr-20 trans-04 pointer"
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: '#fff',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    transition: 'background-color 0.3s ease',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#5a6268')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')}
                            >
                                {t('back_to_home')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;