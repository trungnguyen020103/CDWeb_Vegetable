import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartLocalStorage } from "../../store/Actions";

const Header = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);

	useEffect(() => {
		fetch('/session')
			.then((response) => response.json())
			.then((data) => {
				if (data.loggedIn) {
					setLoggedIn(true);
					setUsername(data.username);
					setId(data.userId);
				}
			})
			.catch((error) => {
				console.error('Error fetching session:', error);
			});
	}, []);

	const handleLogout = async () => {
		try {
			const response = await fetch('/logout', { method: 'POST' });
			const data = await response.json();
			if (data.message === 'Logout successful') {
				setLoggedIn(false);
				setUsername('');
			}
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<header className="header-v4">
			<div className="container-menu-desktop">
				<div className="top-bar">
					<div className="content-topbar flex-sb-m h-full container">
						<div className="left-top-bar">
							Miễn phí vận chuyển cho đơn hàng tiêu chuẩn trên $100
						</div>
						<div className="right-top-bar flex-w h-full">
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								Trợ giúp và câu hỏi thường gặp
							</a>
							{/*<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m p-lr-10 trans-04">*/}
							<a href={'/profile'} className="flex-c-m p-lr-10 trans-04">
								{username ? <span>{username}</span> : <span>Tài Khoản Của Tôi</span>}
							</a>
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								EN
							</a>
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								VNĐ
							</a>
							<a href="/register" className="flex-c-m trans-04 p-lr-25">
								{username ? <span>{username}</span> : <span>Đăng kí</span>}
							</a>
							<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m trans-04 p-lr-25">
								{username ? <span>{username}</span> : <span>Đăng nhập</span>}
							</a>
						</div>
					</div>
				</div>
				<div className="wrap-menu-desktop how-shadow1">
					<nav className="limiter-menu-desktop container">
						<a href="/home" className="logo">
							<img src={`${process.env.PUBLIC_URL}/assets/images/icons/logo-01.png`} alt="IMG-LOGO" />
						</a>
						<div className="menu-desktop">
							<ul className="main-menu">
								<li key="home"><a href="/home">Trang chủ</a></li>
								<li key="product" className="active-menu"><a href="/product">Cửa hàng</a></li>
								<li key="cart" className="label1" data-label1="hot"><a href="/shoppingCart">Giỏ hàng</a></li>
								<li key="about"><a href="/aboutUs">Giới Thiệu</a></li>
								<li key="contact"><a href="/contact">Liên Hệ</a></li>
								<li key="dropdown">
									<div className="dropdown">
										{/* Uncomment and adjust if needed */}
										{/* <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                                            Tính năng đặc biệt
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="/camera">Chụp Hình</a>
                                            <a className="dropdown-item" href="/video">Quay Phim</a>
                                        </div> */}
									</div>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</div>
			<div className="menu-mobile">
				<ul className="topbar-mobile">
					<li key="shipping">
						<div className="left-top-bar">
							Miễn phí vận chuyển cho tiêu chuẩn đơn hàng trên $100
						</div>
					</li>
					<li key="topbar-links">
						<div className="right-top-bar flex-w h-full">
							<a href="/home" className="flex-c-m p-lr-10 trans-04">Help & FAQs</a>
							{/*<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m p-lr-10 trans-04">*/}
							<a href={'/profile'} className="flex-c-m p-lr-10 trans-04">
								{username ? <span>{username}</span> : <span>Tài Khoản Của Tôi</span>}
							</a>
							<a href="/home" className="flex-c-m p-lr-10 trans-04">EN</a>
							<a href="/home" className="flex-c-m p-lr-10 trans-04">VNĐ</a>
						</div>
					</li>
				</ul>
				<ul className="main-menu-m">
					<li key="mobile-home"><a href="/home">Trang Chủ</a></li>
					<li key="mobile-product"><a href="/product">Cửa hàng</a></li>
					<li key="mobile-cart"><a href="/shoppingCart" className="label1 rs1" data-label1="hot">Giỏ hàng</a></li>
					<li key="mobile-about"><a href="/aboutUs">Giới Thiệu</a></li>
					<li key="mobile-contact"><a href="/contact">Liên Hệ</a></li>
				</ul>
			</div>
		</header>
	);
};

export default Header;