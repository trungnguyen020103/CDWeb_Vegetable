import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../Toast/ToastContext';

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        fullname: '',
        address: '',
        phonenumber: '',
    });
    const [formErrors, setFormErrors] = useState({
        fullname: '',
        phonenumber: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('accessToken');
    const { showToast } = useToast();

    // Validation functions
    const validatePhoneNumber = (phonenumber) => {
        if (!phonenumber) return ''; // Phone number is optional
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        return phoneRegex.test(phonenumber) ? '' : t('phone_invalid');
    };

    const validateFullname = (fullname) => {
        return fullname.trim() ? '' : t('fullname_required');
    };

    // Validate form
    const validateForm = () => {
        const errors = {
            fullname: validateFullname(formData.fullname),
            phonenumber: validatePhoneNumber(formData.phonenumber),
        };
        setFormErrors(errors);
        return Object.values(errors).every((error) => error === '');
    };

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getbyid/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
            setFormData({
                id: response.data.id,
                fullname: response.data.fullname || '',
                address: response.data.address || '',
                phonenumber: response.data.phonenumber || '',
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            setError(t('user_error'));
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    }, [idUser, token, navigate, t]);

    useEffect(() => {
        if (!idUser || !token) {
            navigate('/login');
        } else {
            fetchUser();
        }
    }, [idUser, token, fetchUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation
        if (name === 'fullname') {
            setFormErrors({ ...formErrors, fullname: validateFullname(value) });
        } else if (name === 'phonenumber') {
            setFormErrors({ ...formErrors, phonenumber: validatePhoneNumber(value) });
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(null);
        setSuccess(null);
        setFormErrors({
            fullname: '',
            phonenumber: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            showToast(t('form_invalid'), 'error');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8080/user/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showToast(t('update_success'), 'success');
            setSuccess(t('update_success'));
            setUser({ ...user, ...formData });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating information:', error);
            if (error.response?.data) {
                setError(
                    typeof error.response.data === 'object'
                        ? Object.values(error.response.data).join(', ')
                        : error.response.data
                );
            } else {
                setError(t('update_error'));
            }
            showToast(t('update_error'), 'error');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('idUser');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }

        navigate('/login');
    };

    if (error) {
        return <div className="text-danger text-center">{error}</div>;
    }

    if (!user) {
        return <div className="text-center">{t('loading_user')}</div>;
    }

    const avatarUrl = 'https://startbootstrap.github.io/startbootstrap-freelancer/assets/img/avataaars.svg';

    return (
        <div>
            <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                <div className="profile-container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-lg-6 mb-4 mb-lg-0">
                            <div className="profile-card mb-3" style={{ borderRadius: '.5rem' }}>
                                <div className="row g-0">
                                    <div
                                        className="col-md-4 profile-gradient text-center text-white profile-avatar"
                                        style={{
                                            borderTopLeftRadius: '.5rem',
                                            borderBottomLeftRadius: '.5rem',
                                        }}
                                    >
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="img-fluid my-5"
                                            style={{ width: '80px' }}
                                        />
                                        <h5 className="profile-username">{user.fullname || t('not_available')}</h5>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={handleEditToggle}
                                        >
                                            {isEditing ? t('cancel') : t('change_info')}
                                        </button>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={() => navigate('/changePassword')}
                                        >
                                            {t('change_password')}
                                        </button>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={() => navigate('/order')}
                                        >
                                            {t('order_info')}
                                        </button>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={logout}
                                        >
                                            {t('logout')}
                                        </button>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="profile-info p-4">
                                            <h6>{t('information')}</h6>
                                            <hr className="mt-0 mb-4" />
                                            {isEditing ? (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row pt-1">
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="email" className="form-label">
                                                                {t('email_label')}
                                                            </label>
                                                            <p className="text-muted">{user.email || t('not_available')}</p>
                                                        </div>
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="fullname" className="form-label">
                                                                {t('fullname_label')}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${formErrors.fullname ? 'is-invalid' : ''}`}
                                                                id="fullname"
                                                                name="fullname"
                                                                value={formData.fullname}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                            {formErrors.fullname && (
                                                                <div className="invalid-feedback">{formErrors.fullname}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="address" className="form-label">
                                                                {t('address_label')}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="address"
                                                                name="address"
                                                                value={formData.address}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="phonenumber" className="form-label">
                                                                {t('phone_label')}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${formErrors.phonenumber ? 'is-invalid' : ''}`}
                                                                id="phonenumber"
                                                                name="phonenumber"
                                                                value={formData.phonenumber}
                                                                onChange={handleInputChange}
                                                            />
                                                            {formErrors.phonenumber && (
                                                                <div className="invalid-feedback">{formErrors.phonenumber}</div>
                                                            )}
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            <button type="submit" className="btn btn-primary me-2">
                                                                {t('save')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="row pt-1">
                                                    <div className="col-12 mb-3">
                                                        <h6>{t('email_label')}</h6>
                                                        <p className="text-muted">{user.email || t('not_available')}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>{t('fullname_label')}</h6>
                                                        <p className="text-muted">{user.fullname || t('not_available')}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>{t('address_label')}</h6>
                                                        <p className="text-muted">{user.address || t('not_available')}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>{t('phone_label')}</h6>
                                                        <p className="text-muted">{user.phonenumber || t('not_available')}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {success && <div className="alert alert-success mt-3">{success}</div>}
                                            <div className="d-flex justify-content-start">
                                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-facebook-f fa-lg me-3"></i>
                                                </a>
                                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-twitter fa-lg me-3"></i>
                                                </a>
                                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-instagram fa-lg"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;