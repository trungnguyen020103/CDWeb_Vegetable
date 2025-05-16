import { useState } from 'react';
import { AlertTriangle, CheckCircle, Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import './register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Tên người dùng không được để trống';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Tên đầy đủ không được để trống';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        const phoneRegex = /^\d{10,11}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            console.log('Form submitted:', formData);
            setIsSubmitted(true);

            setFormData({
                username: '',
                fullName: '',
                password: '',
                confirmPassword: '',
                email: '',
                phone: ''
            });
        } else {
            setErrors(validationErrors);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="container1">
            <div className="card">
                <div className="header12">
                    <h2>Đăng Ký Tài Khoản</h2>
                    <p>Tạo tài khoản để trải nghiệm dịch vụ của chúng tôi</p>
                </div>

                <div className="form-container">
                    {isSubmitted && (
                        <div className="success-message">
                            <CheckCircle className="mr-3" size={24} />
                            <span>Đăng ký thành công! Chào mừng bạn tham gia.</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Username */}
                        <div className="input-group">
                            <label htmlFor="username">
                                Tên người dùng <span>*</span>
                            </label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`input-field ${errors.username ? 'error' : ''}`}
                                    placeholder="Nhập tên người dùng"
                                />
                            </div>
                            {errors.username && (
                                <p className="error-message">
                                    <AlertTriangle size={14} />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className="input-group">
                            <label htmlFor="fullName">
                                Tên đầy đủ <span>*</span>
                            </label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`input-field ${errors.fullName ? 'error' : ''}`}
                                    placeholder="Nhập tên đầy đủ"
                                />
                            </div>
                            {errors.fullName && (
                                <p className="error-message">
                                    <AlertTriangle size={14} />
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="password">
                                Mật khẩu <span>*</span>
                            </label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`password-field ${errors.password ? 'error' : ''}`}
                                    placeholder="Nhập mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="error-message">
                                    <AlertTriangle size={14} />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <label htmlFor="confirmPassword">
                                Nhập lại mật khẩu <span>*</span>
                            </label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`password-field ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="error-message">
                                    <AlertTriangle size={14} />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="email">
                                Email <span>*</span>
                            </label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input-field ${errors.email ? 'error' : ''}`}
                                    placeholder="Nhập địa chỉ email"
                                />
                            </div>
                            {errors.email && (
                                <p className="error-message">
                                    <AlertTriangle size={14} />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="input-group">
                            <label htmlFor="phone">
                                Số điện thoại
                            </label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`input-field ${errors.phone ? 'error' : ''}`}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            {errors.phone && (
                                <p className="error-message">
                                    <AlertTriangle size={14} />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                onClick={handleSubmit}
                                className="submit-button"
                            >
                                Đăng Ký Ngay
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="divider">
                            <div className="divider-line"></div>
                            <div className="divider-text">
                                <span>hoặc Đăng ký với</span>
                            </div>
                        </div>

                        {/* Social Signup */}
                        <div className="social-buttons">
                            <button className="social-button">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M12 5c1.617 0 3.063.625 4.17 1.650l3.034-3.034C17.505 1.985 14.895 1 12 1 7.038 1 2.903 4.153 1.386 8.55l3.405 2.648C5.854 7.642 8.734 5 12 5z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.26 2.53c1.88-1.89 2.95-4.66 2.95-8.35z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.41 14.32l-3.49 2.73C2.93 20.05 7.04 23 12 23c3.04 0 5.6-1.01 7.47-2.73l-3.36-2.58c-.93.64-2.11 1.02-4.11 1.02-3.16 0-5.84-2.14-6.81-5.02l-.78.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5c1.98 0 3.75.67 5.14 1.97l2.62-2.6C17.77 2.42 15.06 1 12 1 7.61 1 3.9 3.42 2.02 6.97l3.04 2.65C5.9 7.01 8.66 5 12 5z"
                                    />
                                </svg>
                                Google
                            </button>

                        </div>

                        {/* Login Link */}
                        <div className="login-link">
                            Đã có tài khoản?{' '}
                            <span>Đăng nhập ngay</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}