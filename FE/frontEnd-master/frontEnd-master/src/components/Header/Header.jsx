import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from '../../api/axiosConfig';
import { clearCartLocalStorage } from '../../store/Actions';
const Header = () => {
	const { t, i18n } = useTranslation();
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);

	useEffect(() => {
		fetch('/session')
			.then((response) => response.json())
			.then((data) => {
				if (data.loggedIn) {
					setLoggedIn(true);
					setUsername(data.username);
					setId(data.userId);
					axios.get(`/user/getbyid/${data.userId}`).then((res) => {
						if (res.data.language) {
							i18n.changeLanguage(res.data.language);
						}
					});
				}
			})
			.catch((error) => console.error('Error fetching session:', error));
	}, []);

	const handleLogout = async () => {
		try {
			const response = await fetch('/logout', { method: 'POST' });
			const data = await response.json();
			if (data.message === 'Logout successful') {
				setLoggedIn(false);
				setUsername('');
				dispatch(clearCartLocalStorage());
			}
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		if (loggedIn) {
			axios.post('/user/language', { email: username, language: lng }).catch((err) => {
				console.error('Error updating language:', err);
			});
		}
	};

	return (
		<header className="header-v4">
			<div className="container-menu-desktop">
				<div className="top-bar">
					<div className="content-topbar flex-sb-m h-full container">
						<div className="left-top-bar">{t('free_shipping')}</div>
						<div className="right-top-bar flex-w h-full">
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								{t('help_faqs')}
							</a>
							<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m trans-04 p-lr-25">
								{username ? <span>{username}</span> : <span>{t('my_account')}</span>}
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									changeLanguage('en');
								}}
								className="flex-c-m trans-04 p-lr-25"
							>
								EN
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									changeLanguage('vi');
								}}
								className="flex-c-m trans-04 p-lr-25"
							>
								VN
							</a>
							<a href="/register" className="flex-c-m trans-04 p-lr-25">
								{username ? <span>{username}</span> : <span>{t('register')}</span>}
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									loggedIn ? handleLogout() : navigate('/login');
								}}
								className="flex-c-m trans-04 p-lr-25"
							>
								{loggedIn ? t('logout') : t('login')}
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
								<li key="home">
									<a href="/home">{t('home')}</a>
								</li>
								<li key="product" className="active-menu">
									<a href="/product">{t('shop')}</a>
								</li>
								<li key="cart" className="label1" data-label1="hot">
									<a href="/shoppingCart">{t('cart')}</a>
								</li>
								<li key="about">
									<a href="/aboutUs">{t('about')}</a>
								</li>
								<li key="contact">
									<a href="/contact">{t('contact')}</a>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</div>
			<div className="menu-mobile">
				<ul className="topbar-mobile">
					<li key="shipping">
						<div className="left-top-bar">{t('free_shipping')}</div>
					</li>
					<li key="topbar-links">
						<div className="right-top-bar flex-w h-full">
							<a href="/home" className="flex-c-m p-lr-10 trans-04">
								{t('help_faqs')}
							</a>
							<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m p-lr-10 trans-04">
								{username ? <span>{username}</span> : <span>{t('my_account')}</span>}
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									changeLanguage('en');
								}}
								className="flex-c-m p-lr-10 trans-04"
							>
								EN
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									changeLanguage('vi');
								}}
								className="flex-c-m p-lr-10 trans-04"
							>
								VN
							</a>
						</div>
					</li>
				</ul>
				<ul className="main-menu-m">
					<li key="mobile-home">
						<a href="/home">{t('home')}</a>
					</li>
					<li key="mobile-product">
						<a href="/product">{t('shop')}</a>
					</li>
					<li key="mobile-cart">
						<a href="/shoppingCart" className="label1 rs1" data-label1="hot">
							{t('cart')}
						</a>
					</li>
					<li key="mobile-about">
						<a href="/aboutUs">{t('about')}</a>
					</li>
					<li key="mobile-contact">
						<a href="/contact">{t('contact')}</a>
					</li>
				</ul>
			</div>
		</header>
	);
};

export default Header;