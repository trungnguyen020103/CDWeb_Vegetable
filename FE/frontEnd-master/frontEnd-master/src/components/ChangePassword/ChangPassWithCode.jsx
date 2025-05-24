import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './changepasswithcode.css';

const ChangePassWithCode = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        code: '',
        newPassword: '',
        form: '',
    });
//validatee email
    const validateEmail = (email) => {
        if (!email) return 'Email không được để trống';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) ? '' : 'Email không đúng định dạng';
    };

    const validateCode = (code) => {
        if (!code) return 'Mã xác nhận không được để trống';
        return code.length >= 6 ? '' : 'Mã xác nhận phải có ít nhất 6 ký tự';
    };

    const validatePassword = (password) => {
        if (!password) return 'Mật khẩu không được để trống';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!/[A-Z]/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
        if (!/[\W_]/.test(password)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
        if (!/[0-9]/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ số';
        return '';
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validate theo trường
        if (value) {
            if (name === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
            if (name === 'code') setErrors((prev) => ({ ...prev, code: validateCode(value) }));
            if (name === 'newPassword') setErrors((prev) => ({ ...prev, newPassword: validatePassword(value) }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(formData.email);
        const codeError = validateCode(formData.code);
        const passwordError = validatePassword(formData.newPassword);

        if (emailError || codeError || passwordError) {
            setErrors({ email: emailError, code: codeError, newPassword: passwordError, form: 'Vui lòng kiểm tra lại thông tin.' });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/changepasswithcode', {
                email: formData.email,
                code: formData.code,
                newPassword: formData.newPassword,
            });

            if (!response.data) {
                setErrors((prev) => ({ ...prev, form: 'Phản hồi từ server không hợp lệ.' }));
                return;
            }

            setErrors((prev) => ({ ...prev, form: 'Đổi mật khẩu thành công!' }));
            navigate('/login');
        } catch (error) {
            console.error('Change password failed:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            setErrors((prev) => ({ ...prev, form: errorMessage }));
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <div className="change-password-header">
                    <h2>Đổi mật khẩu bằng mã xác nhận</h2>
                    <p className="change-password-subtitle">
                        Vui lòng nhập email, mã xác nhận và mật khẩu mới
                    </p>
                </div>

                <div className="change-password-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={() => handleInputChange({ target: { name: 'email', value: formData.email } })}
                                placeholder="Nhập địa chỉ email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="code">Mã xác nhận</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                value={formData.code}
                                onChange={handleInputChange}
                                onBlur={() => handleInputChange({ target: { name: 'code', value: formData.code } })}
                                placeholder="Nhập mã xác nhận"
                            />
                            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                onBlur={() => handleInputChange({ target: { name: 'newPassword', value: formData.newPassword } })}
                                placeholder="Nhập mật khẩu mới"
                            />
                            {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                            <small className="form-text text-muted">
                                Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 ký tự đặc biệt và 1 chữ số
                            </small>
                        </div>

                        <div className="form-group change-password-btn-container">
                            <button type="submit" className="change-password-btn">
                                Đổi mật khẩu
                            </button>
                        </div>

                        {errors.form && (
                            <div className={`alert ${errors.form.includes('thành công') ? 'alert-success' : 'alert-danger'}`} role="alert">
                                {errors.form}
                            </div>
                        )}
                    </form>

                    <div className="login-link">
                        <p>
                            Bạn đã có tài khoản?{' '}
                            <a href="/login">Đăng nhập</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassWithCode;