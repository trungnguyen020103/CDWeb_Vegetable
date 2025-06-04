import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        fullname: '',
        address: '',
        phonenumber: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('accessToken');

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
            console.error('Lỗi khi fetch user:', error);
            setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    }, [idUser, token, navigate]);

    useEffect(() => {
        if (!idUser || !token) {
            navigate('/login');
        } else {
            fetchUser();
        }
    }, [idUser, token, fetchUser, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(
                'http://localhost:8080/user/update',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess(response.data); // Thông báo thành công từ backend
            setUser({ ...user, ...formData }); // Cập nhật thông tin hiển thị
            setIsEditing(false); // Thoát chế độ chỉnh sửa
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            if (error.response?.data) {
                setError(
                    typeof error.response.data === 'object'
                        ? Object.values(error.response.data).join(', ')
                        : error.response.data
                );
            } else {
                setError('Cập nhật thông tin thất bại. Vui lòng thử lại.');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('idUser');
        localStorage.removeItem('tokenExpiration');

        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }

        navigate('/login');
    };

    if (error) {
        return <div className="text-danger text-center">{error}</div>;
    }

    if (!user) {
        return <div className="text-center">Đang tải...</div>;
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
                                        <h5 className="profile-username">{user.fullname || 'N/A'}</h5>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={handleEditToggle}
                                        >
                                            {isEditing ? 'Hủy' : 'Đổi thông tin'}
                                        </button>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={() => navigate('/changePassword')}
                                        >
                                            Đổi Mật Khẩu
                                        </button>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={() => navigate('/order')}
                                        >
                                            Thông tin đơn hàng
                                        </button>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                            onClick={logout}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="profile-info p-4">
                                            <h6>Thông Tin</h6>
                                            <hr className="mt-0 mb-4" />
                                            {isEditing ? (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row pt-1">
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="email" className="form-label">
                                                                Email
                                                            </label>
                                                            <p className="text-muted">{user.email || 'N/A'}</p>
                                                        </div>
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="fullname" className="form-label">
                                                                Họ tên
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="fullname"
                                                                name="fullname"
                                                                value={formData.fullname}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-12 mb-3">
                                                            <label htmlFor="address" className="form-label">
                                                                Địa chỉ
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
                                                                Số điện thoại
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="phonenumber"
                                                                name="phonenumber"
                                                                value={formData.phonenumber}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            <button type="submit" className="btn btn-primary me-2">
                                                                Lưu
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="row pt-1">
                                                    <div className="col-12 mb-3">
                                                        <h6>Email</h6>
                                                        <p className="text-muted">{user.email || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>Họ tên</h6>
                                                        <p className="text-muted">{user.fullname || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>Địa chỉ</h6>
                                                        <p className="text-muted">{user.address || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>Số điện thoại</h6>
                                                        <p className="text-muted">{user.phonenumber || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            )}
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