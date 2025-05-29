import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
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

    const avatarUrl ='https://startbootstrap.github.io/startbootstrap-freelancer/assets/img/avataaars.svg';



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
                                            onClick={() => navigate('/edit-profile')}
                                        >
                                            Đổi thông tin
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
                                            <div className="row pt-1">
                                                <div className="col-12 mb-6">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">{user.email || 'N/A'}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Họ tên người dùng</h6>
                                                    <p className="text-muted">{user.fullname}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Địa Chỉ</h6>
                                                    <p className="text-muted">{user.address || 'N/A'}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Số Điện Thoại</h6>
                                                    <p className="text-muted">{user.phonenumber || 'N/A'}</p>
                                                </div>
                                            </div>
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