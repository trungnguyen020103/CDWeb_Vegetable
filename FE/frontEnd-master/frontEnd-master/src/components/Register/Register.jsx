import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [fullnameError, setFullnameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');

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
        } else if (password.length < 6) {
            setPasswordError(t('password_too_short'));
            return false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError(t('password_no_uppercase'));
            return false;
        } else if (!/[\W_]/.test(password)) {
            setPasswordError(t('password_no_special'));
            return false;
        } else if (!/[0-9]/.test(password)) {
            setPasswordError(t('password_no_digit'));
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const validateFullname = (fullname) => {
        if (!fullname) {
            setFullnameError(t('fullname_notblank'));
            return false;
        } else if (fullname.length < 3) {
            setFullnameError(t('fullname_too_short'));
            return false;
        } else {
            setFullnameError('');
            return true;
        }
    };

    const validateAddress = (address) => {
        if (!address) {
            setAddressError(t('address_notblank'));
            return false;
        } else if (address.length < 5) {
            setAddressError(t('address_too_short'));
            return false;
        } else {
            setAddressError('');
            return true;
        }
    };

    const validatePhone = (phone) => {
        const re = /^[0-9]{10,11}$/;
        if (!phone) {
            setPhoneError(t('phone_notblank'));
            return false;
        } else if (!re.test(phone)) {
            setPhoneError(t('phone_invalid'));
            return false;
        } else {
            setPhoneError('');
            return true;
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value) validateEmail(value);
        else setEmailError('');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value) validatePassword(value);
        else setPasswordError('');
    };

    const handleFullnameChange = (e) => {
        const value = e.target.value;
        setFullname(value);
        if (value) validateFullname(value);
        else setFullnameError('');
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        if (value) validateAddress(value);
        else setAddressError('');
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhonenumber(value);
        if (value) validatePhone(value);
        else setPhoneError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isFullnameValid = validateFullname(fullname);
        const isAddressValid = validateAddress(address);
        const isPhoneValid = validatePhone(phonenumber);

        if (isEmailValid && isPasswordValid && isFullnameValid && isAddressValid && isPhoneValid) {
            try {
                const response = await axios.post('http://localhost:8080/auth/register', {
                    email,
                    password,
                    fullname,
                    address,
                    phonenumber,
                });

                if (!response.data) {
                    setMessage(t('register_error'));
                    return;
                }
                setMessage(t('register_success'));
                navigate('/login');
            } catch (error) {
                console.error('Registration failed:', error);
                if (error.response) {
                    setMessage(error.response.data || t('register_error'));
                } else {
                    setMessage(t('register_error'));
                }
            }
        } else {
            setMessage(t('check_form'));
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>{t('register_account')}</h2>
                    <p className="register-subtitle">{t('register_subtitle')}</p>
                </div>

                <div className="register-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullname">{t('fullname_label')}</label>
                            <input
                                type="text"
                                id="fullname"
                                className={`form-control ${fullnameError ? 'is-invalid' : ''}`}
                                value={fullname}
                                onChange={handleFullnameChange}
                                onBlur={() => fullname && validateFullname(fullname)}
                                placeholder={t('fullname_placeholder')}
                            />
                            {fullnameError && <div className="invalid-feedback">{fullnameError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">{t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => email && validateEmail(email)}
                                placeholder={t('email_placeholder')}
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{t('password')}</label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => password && validatePassword(password)}
                                placeholder={t('password_placeholder')}
                            />
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">{t('address_label')}</label>
                            <input
                                type="text"
                                id="address"
                                className={`form-control ${addressError ? 'is-invalid' : ''}`}
                                value={address}
                                onChange={handleAddressChange}
                                onBlur={() => address && validateAddress(address)}
                                placeholder={t('address_placeholder')}
                            />
                            {addressError && <div className="invalid-feedback">{addressError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">{t('phone_label')}</label>
                            <input
                                type="tel"
                                id="phone"
                                className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                                value={phonenumber}
                                onChange={handlePhoneChange}
                                onBlur={() => phonenumber && validatePhone(phonenumber)}
                                placeholder={t('phone_placeholder')}
                            />
                            {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                        </div>

                        <div className="form-group register-btn-container">
                            <button type="submit" className="register-btn">
                                {t('register_button')}
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
                            {t('already_have_account')} <a href="/login">{t('login_link')}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;