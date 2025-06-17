import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../../axiosConfig';
import './Login.css';
import { useToast } from '../../Toast/ToastContext';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { showToast } = useToast();
    const [role, setRole] = useState('');
    const [user, setUser] = useState({});

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError(t('email_notblank'));
            return false;
        } else if (!re.test(email)) {
            setEmailError(t('email_invalid'));
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError(t('password_notblank'));
            return false;
        } else if (password.length < 8) {
            setPasswordError(t('password_invalid_format'));
            return false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError(t('password_invalid_format'));
            return false;
        } else if (!/[\W_]/.test(password)) {
            setPasswordError(t('password_invalid_format'));
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

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login/google', {
                googleToken: credentialResponse.credential,
            });

            if (!response.data || !response.data.accessToken) {
                setMessage(t('login_failed'));
                showToast(t('login_failed'), 'error');
                return;
            }

            const { accessToken, refreshToken, expiration, tokenType, idUser } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('tokenType', tokenType);
            localStorage.setItem('idUser', idUser);
            localStorage.setItem('tokenExpiration', Date.now() + expiration);

            const token = localStorage.getItem("accessToken");
            const userId = localStorage.getItem("idUser");

            const userRes = await axios.get(`http://localhost:8080/user/getbyid/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const user = userRes.data;
            const role = user.role;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", role);

            console.log("Lấy thông tin user thành công:", user);

            showToast(t('login_success'), 'success');
            navigate('/profile');
        } catch (error) {
            showToast(t('login_failed'), 'error');
            console.error('Login with Google failed:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data || t('login_failed'));
            } else {
                setMessage(t('login_failed'));
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
                    setMessage(t('login_failed'));
                    showToast(t('login_failed'), 'error');
                    return;
                }

                const { accessToken, refreshToken, expiration, tokenType, idUser } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('tokenType', tokenType);
                localStorage.setItem('idUser', idUser);
                localStorage.setItem('tokenExpiration', Date.now() + expiration);

                showToast(t('login_success'), 'success');
                navigate('/profile');
            } catch (error) {
                showToast(t('login_failed'), 'error');
                console.error('Login failed:', error);
                if (error.response && error.response.data) {
                    setMessage(error.response.data || t('login_failed'));
                } else {
                    setMessage(t('login_failed'));
                }
            }
        }
    };

    return (
        <GoogleOAuthProvider clientId="549564714080-vk7qdj3d4jdejaq4921mhdsm4ta67qas.apps.googleusercontent.com">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>{t('login')}</h2>
                        <p className="login-subtitle">{t('welcome')}</p>
                    </div>

                    <div className="login-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    id="emailInput"
                                    placeholder={t('email_placeholder')}
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={() => email && validateEmail(email)}
                                />
                                <label htmlFor="emailInput">{t('email')}</label>
                                {emailError && <div className="invalid-feedback">{emailError}</div>}
                            </div>

                            <div className="form-floating mb-4">
                                <input
                                    type="password"
                                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                    id="passwordInput"
                                    placeholder={t('password')}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => password && validatePassword(password)}
                                />
                                <label htmlFor="passwordInput">{t('password')}</label>
                                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                            </div>

                            <div className="d-flex justify-content-end mb-4">
                                <a href="/forgotPassword" className="forgot-password">
                                    {t('forgot_password')}
                                </a>
                            </div>

                            <div className="d-grid gap-2 mb-4">
                                <button type="submit" className="btn btn-primary login-btn">
                                    {t('login')}
                                </button>
                            </div>

                            <div className="separator">
                                <span>{t('or')}</span>
                            </div>

                            <div className="google-login-container">
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={() => {
                                        console.log('Login Failed');
                                        showToast(t('login_failed'), 'error');
                                    }}
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
                                {t('no_account')} <a href="/register">{t('register_now')}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;