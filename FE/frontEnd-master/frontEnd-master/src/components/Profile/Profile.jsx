import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './profile.css';

const Profile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const idUser = localStorage.getItem('idUser');
        console.log('idUser in Profile:', idUser);
        if (!idUser) {
            navigate('/login');
        }
    }, []);

    const user = {
        username: 'Nguyen Van A',
        email: 'nguyenvana@example.com',
        dob: '01/01/1990',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        gender: '1',
        phoneNumber: '0123456789',
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('idUser');
        localStorage.removeItem('tokenExpiration');

        if (window.google && window.google.accounts) {
            window.google.accounts.id.disableAutoSelect();
        }

        window.location.href = '/login';
    };

    const avatarUrl =
        user.gender === '1'
            ? 'https://startbootstrap.github.io/startbootstrap-freelancer/assets/img/avataaars.svg'
            : user.gender === '2'
                ? 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp'
                : 'https://storage.timviec365.vn/timviec365/pictures/images/lgbt-la-gi(2).jpg';

    const genderText =
        user.gender === '1' ? 'Nam' : user.gender === '2' ? 'Nữ' : 'Giới Tính Khác';

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
                                        <h5 className="profile-username">{user.username}</h5>

                                        <a>
                                            <button
                                                className="profile-button mt-2"
                                                style={{ backgroundColor: '#E9FF97' }}
                                            >
                                                Đổi thông tin
                                            </button>
                                        </a>
                                        <a href="/changePassword">
                                            <button
                                                className="profile-button"
                                                style={{ backgroundColor: '#FFD18E' }}
                                            >
                                                Đổi Mật Khẩu
                                            </button>
                                        </a>
                                        <button
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
                                        >
                                            Thông tin đơn hàng
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="profile-button mt-2"
                                            style={{ backgroundColor: '#E9FF97' }}
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
                                                    <p className="text-muted">{user.email}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Ngày Sinh</h6>
                                                    <p className="text-muted">{user.dob}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Địa Chỉ</h6>
                                                    <p className="text-muted">{user.address}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Giới Tính</h6>
                                                    <p className="text-muted">{genderText}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Số Điện Thoại</h6>
                                                    <p className="text-muted">{user.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-start">
                                                <a href="#!">
                                                    <i className="fab fa-facebook-f fa-lg me-3"></i>
                                                </a>
                                                <a href="#!">
                                                    <i className="fab fa-twitter fa-lg me-3"></i>
                                                </a>
                                                <a href="#!">
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