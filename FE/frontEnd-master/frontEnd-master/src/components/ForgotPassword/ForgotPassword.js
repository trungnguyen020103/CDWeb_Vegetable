import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgotpassword.css';
import axios from "axios";
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState('');

    // Validate email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email không được để trống');
            return false;
        } else if (!re.test(email)) {
            setEmailError('Email không đúng định dạng');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value) validateEmail(value);
        else setEmailError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setMessage('Vui lòng kiểm tra lại email.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/sendmail', {
                recipient: email
            });


            if (response.status === 200) {
                setMessage('Gửi email thành công!');
                navigate('/changewithcode');
            } else {
                setMessage('Phản hồi từ server không hợp lệ.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            let errorMessage = 'Thất bại, vui lòng thử lại.';
            if (error.response?.data) {
                if (typeof error.response.data === 'object') {
                    const errors = error.response.data;
                    errorMessage = errors.email || 'Vui lòng kiểm tra lại thông tin.';
                } else {
                    errorMessage = error.response.data || errorMessage;
                }
            }
            setMessage(errorMessage);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <h2>Quên mật khẩu</h2>
                    <p className="forgot-password-subtitle">Vui lòng nhập email để nhận liên kết đặt lại mật khẩu</p>
                </div>

                <div className="forgot-password-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => email && validateEmail(email)}
                                placeholder="Nhập địa chỉ email"
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>

                        <div className="form-group forgot-password-btn-container">
                            <button type="submit" className="forgot-password-btn">
                                Gửi yêu cầu
                            </button>
                        </div>

                        {message && (
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        )}
                    </form>

                    <div className="login-link">
                        <p>
                            Bạn đã có tài khoản?{' '}
                            <a href="/login">
                                Đăng nhập
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;