import React, { useState } from 'react';
import './changepassword.css';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { useToast } from '../../Toast/ToastContext';
const ChangePassword = () => {
    const {showToast} = useToast();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('accessToken');

    // Validate
    const validateNewPassword = (password) => {
        if (!password) return 'Mật khẩu mới không được để trống';
        if (password.length < 6) return 'Mật khẩu mới phải có ít nhất 6 ký tự';
        if (!/[A-Z]/.test(password)) return 'Mật khẩu mới phải có ít nhất 1 chữ hoa';
        if (!/[\W_]/.test(password)) return 'Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt';
        if (!/[0-9]/.test(password)) return 'Mật khẩu mới phải có ít nhất 1 chữ số';
        return '';
    };

    // Validate confirm password
    const validateConfirmPassword = (confirm, newPass) => {
        if (!confirm) return 'Xác nhận mật khẩu không được để trống';
        return confirm === newPass ? '' : 'Mật khẩu xác nhận không khớp';
    };

    // Handle input changes
    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setNewPasswordError(value ? validateNewPassword(value) : '');
        if (confirmPassword) setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(value ? validateConfirmPassword(value, newPassword) : '');
    };

    // Handle form submission
    const handleChangePassword = async (e) => {
        e.preventDefault();

        const newPassError = validateNewPassword(newPassword);
        const confirmPassError = validateConfirmPassword(confirmPassword, newPassword);

        if (newPassError || confirmPassError) {
            setNewPasswordError(newPassError);
            setConfirmPasswordError(confirmPassError);
            setMessage('Vui lòng kiểm tra lại thông tin');
            return;
        }

        if (!idUser || !token) {
            setMessage('Vui lòng đăng nhập để đổi mật khẩu.');
            return;
        }

        setMessage('');

        try {
            const response = await axios.put(
                'http://localhost:8080/user/changepassword',
                {
                    id: idUser,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status ===200) {
                showToast('Đổi mật khẩu thành công!', 'success');
                setMessage(response.data.message || 'Đổi mật khẩu thành công!')
                    navigate('/profile')
            } else {
                setMessage(response.data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            showToast('Đổi mật khẩu thất bại!', 'error');
            console.error('Error:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.errors?.newPassword || 'Có lỗi xảy ra, vui lòng thử lại.';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <div className="change-password-header">
                    <h2>Đổi mật khẩu</h2>
                    <p className="change-password-subtitle">
                        Vui lòng nhập mật khẩu mới và xác nhận mật khẩu
                    </p>
                </div>

                <div className="change-password-body">
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                className={`form-control ${newPasswordError ? 'is-invalid' : ''}`}
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                onBlur={() => newPassword && setNewPasswordError(validateNewPassword(newPassword))}
                                placeholder="Nhập mật khẩu mới"
                            />
                            {newPasswordError && <div className="invalid-feedback">{newPasswordError}</div>}
                            <small className="form-text text-muted">
                                Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 ký tự đặc biệt và 1 chữ số
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onBlur={() => confirmPassword && setConfirmPasswordError(validateConfirmPassword(confirmPassword, newPassword))}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
                        </div>

                        <div className="form-group change-password-btn-container">
                            <button type="submit" className="change-password-btn">
                                Đổi mật khẩu
                            </button>
                        </div>

                        {message && (
                            <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`} role="alert">
                                {message}
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

export default ChangePassword;