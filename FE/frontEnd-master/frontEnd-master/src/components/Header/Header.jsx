import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { clearCartLocalStorage } from '../../store/Actions';
import axios from '../../axiosConfig'; // Use custom axios

const Header = () => {
	const { t, i18n } = useTranslation();
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);

	const handleLanguageChange = async (lang) => {
		try {
			await i18n.changeLanguage(lang);
			// Optionally notify backend (if you implement a language persistence endpoint)
			await axios.post('http://localhost:8080/api/set-language', { language: lang });
		} catch (error) {
			console.error('Error setting language:', error);
		}
	};

	const handleLogout = async () => {
		try {
			const response = await axios.post('http://localhost:8080/logout');
			if (response.data.message === 'Logout successful') {
				setLoggedIn(false);
				setUsername('');
				localStorage.clear();
				dispatch(clearCartLocalStorage());
				navigate('/login');
			}
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		const storedUsername = localStorage.getItem('username');
		const userId = localStorage.getItem('idUser');
		if (token && storedUsername && userId) {
			setLoggedIn(true);
			setUsername(storedUsername);
			setId(userId);
		}
	}, []);

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
							<a href="/profile" className="flex-c-m p-lr-10 trans-04">
								{username ? <span>{username}</span> : <span>{t('my_account')}</span>}
							</a>
							<a
								href="#"
								className="flex-c-m trans-04 p-lr-25"
								onClick={() => handleLanguageChange('en')}
							>
								EN
							</a>
							<a
								href="#"
								className="flex-c-m trans-04 p-lr-25"
								onClick={() => handleLanguageChange('vi')}
							>
								VN
							</a>
							<a href="/register" className="flex-c-m trans-04 p-lr-25">
								{username ? null : <span>{t('register')}</span>}
							</a>
							{loggedIn ? (
								<a href="#" className="flex-c-m trans-04 p-lr-25" onClick={handleLogout}>
									Logout
								</a>
							) : (
								<a href="/login" className="flex-c-m trans-04 p-lr-25">
									{t('login')}
								</a>
							)}
						</div>
					</div>
				</div>
				<div className="wrap-menu-desktop how-shadow1">
					<nav className="limiter-menu-desktop container">
						<a href="/home" className="logo">
							<img
								src={`${process.env.PUBLIC_URL}/assets/images/logofruit.jpg`}
								alt="IMG-LOGO"
							/>
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
							<a href="/profile" className="flex-c-m p-lr-10 trans-04">
								{username ? <span>{username}</span> : <span>{t('my_account')}</span>}
							</a>
							<a
								href="#"
								className="flex-c-m p-lr-10 trans-04"
								onClick={() => handleLanguageChange('en')}
							>
								EN
							</a>
							<a
								href="#"
								className="flex-c-m p-lr-10 trans-04"
								onClick={() => handleLanguageChange('vi')}
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