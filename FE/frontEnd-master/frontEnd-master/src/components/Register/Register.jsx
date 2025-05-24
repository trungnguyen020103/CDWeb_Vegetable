import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
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
        } else if (!/[0-9]/.test(password)) {
            setPasswordError('Mật khẩu phải có ít nhất 1 chữ số');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    // Validate fullname
    const validateFullname = (fullname) => {
        if (!fullname) {
            setFullnameError('Họ và tên không được để trống');
            return false;
        } else if (fullname.length < 3) {
            setFullnameError('Họ và tên phải có ít nhất 3 ký tự');
            return false;
        } else {
            setFullnameError('');
            return true;
        }
    };

    // Validate address
    const validateAddress = (address) => {
        if (!address) {
            setAddressError('Địa chỉ không được để trống');
            return false;
        } else if (address.length < 5) {
            setAddressError('Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn');
            return false;
        } else {
            setAddressError('');
            return true;
        }
    };

    // Validate phone number
    const validatePhone = (phone) => {
        const re = /^[0-9]{10,11}$/;
        if (!phone) {
            setPhoneError('Số điện thoại không được để trống');
            return false;
        } else if (!re.test(phone)) {
            setPhoneError('Số điện thoại không hợp lệ (10-11 số)');
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
                    setMessage('Phản hồi từ server không hợp lệ.');
                    return;
                }
                setMessage('Đăng ký thành công!');
                navigate('/login');
            } catch (error) {
                console.error('Registration failed:', error);
                if (error.response) {
                    setMessage(error.response.data || 'Đăng ký thất bại.');
                } else {
                    setMessage('Lỗi không xác định khi đăng ký.');
                }
            }
        } else {
            setMessage('Vui lòng kiểm tra lại thông tin đăng ký');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Đăng ký tài khoản</h2>
                    <p className="register-subtitle">Vui lòng điền đầy đủ thông tin để tạo tài khoản mới</p>
                </div>

                <div className="register-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullname">Họ và tên</label>
                            <input
                                type="text"
                                id="fullname"
                                className={`form-control ${fullnameError ? 'is-invalid' : ''}`}
                                value={fullname}
                                onChange={handleFullnameChange}
                                onBlur={() => fullname && validateFullname(fullname)}
                                placeholder="Nhập họ và tên của bạn"
                            />
                            {fullnameError && <div className="invalid-feedback">{fullnameError}</div>}
                        </div>

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

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => password && validatePassword(password)}
                                placeholder="Tạo mật khẩu mới"
                            />
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input
                                type="text"
                                id="address"
                                className={`form-control ${addressError ? 'is-invalid' : ''}`}
                                value={address}
                                onChange={handleAddressChange}
                                onBlur={() => address && validateAddress(address)}
                                placeholder="Nhập địa chỉ của bạn"
                            />
                            {addressError && <div className="invalid-feedback">{addressError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phone"
                                className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                                value={phonenumber}
                                onChange={handlePhoneChange}
                                onBlur={() => phonenumber && validatePhone(phonenumber)}
                                placeholder="Nhập số điện thoại"
                            />
                            {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                        </div>

                        <div className="form-group register-btn-container">
                            <button type="submit" className="register-btn">
                                Đăng ký
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
                            Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;