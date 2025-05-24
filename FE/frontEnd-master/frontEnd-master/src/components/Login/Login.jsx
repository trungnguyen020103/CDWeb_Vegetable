import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

    // Validate password
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('Mật khẩu không được để trống');
            return false;
        } else if (password.length < 6) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError('Mật khẩu phải có ít nhất 1 chữ hoa');
            return false;
        } else if (!/[\W_]/.test(password)) {
            setPasswordError('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (newEmail) {
            validateEmail(newEmail);
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword) {
            validatePassword(newPassword);
        } else {
            setPasswordError('');
        }
    };

    // Handle Google login success
    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login/google', {
                googleToken: credentialResponse.credential,
            });

            if (!response.data || !response.data.accessToken) {
                setMessage('Phản hồi từ server không hợp lệ.');
                return;
            }

            const { accessToken, refreshToken, expiration, tokenType, idUser } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('tokenType', tokenType);
            localStorage.setItem('idUser', idUser);
            localStorage.setItem('tokenExpiration', Date.now() + expiration);

            setMessage('Đăng nhập thành công!');
            navigate('/home');
        } catch (error) {
            console.error('Login with Google failed:', error);
            if (error.response) {
                setMessage(error.response.data.message || 'Đăng nhập thất bại.');
            } else {
                setMessage('Lỗi không xác định khi đăng nhập.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            try {
                const response = await axios.post('http://localhost:8080/auth/login', {
                    email,
                    password,
                });

                if (!response.data || !response.data.accessToken) {
                    setMessage('Phản hồi từ server không hợp lệ.');
                    return;
                }

                const { accessToken, refreshToken, expiration, tokenType, idUser } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('tokenType', tokenType);
                localStorage.setItem('idUser', idUser);
                localStorage.setItem('tokenExpiration', Date.now() + expiration);

                setMessage('Đăng nhập thành công!');
                navigate('/home');
            } catch (error) {
                console.error('Login failed:', error);
                if (error.response) {
                    setMessage(error.response.data || 'Đăng nhập thất bại.');
                } else {
                    setMessage('Lỗi không xác định khi đăng nhập.');
                }
            }
        }
    };

    return (
        <GoogleOAuthProvider clientId="549564714080-vk7qdj3d4jdejaq4921mhdsm4ta67qas.apps.googleusercontent.com">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Đăng nhập</h2>
                        <p className="login-subtitle">Chào mừng bạn quay trở lại!</p>
                    </div>

                    <div className="login-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    id="emailInput"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={() => email && validateEmail(email)}
                                />
                                <label htmlFor="emailInput">Email</label>
                                {emailError && <div className="invalid-feedback">{emailError}</div>}
                            </div>

                            <div className="form-floating mb-4">
                                <input
                                    type="password"
                                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                    id="passwordInput"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => password && validatePassword(password)}
                                />
                                <label htmlFor="passwordInput">Mật khẩu</label>
                                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                            </div>

                            <div className="d-flex justify-content-end mb-4">
                                <a href="/forgotPassword" className="forgot-password">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <div className="d-grid gap-2 mb-4">
                                <button type="submit" className="btn btn-primary login-btn">
                                    Đăng nhập
                                </button>
                            </div>

                            <div className="separator">
                                <span>hoặc</span>
                            </div>

                            <div className="google-login-container">
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={() => console.log('Login Failed')}
                                    size="large"
                                    width="100%"
                                    text="signin_with"
                                    shape="rectangular"
                                />
                            </div>

                            {message && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {message}
                                </div>
                            )}
                        </form>

                        <div className="register-link">
                            <p>
                                Bạn chưa có tài khoản? <a href="/Register">Đăng ký ngay</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;