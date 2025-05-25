import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [year, setYear] = useState(new Date().getFullYear());

	useEffect(() => {
		setYear(new Date().getFullYear());
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError(t('email_invalid'));
		} else {
			setError(null);
			// Gửi email đến API (nếu có)
			console.log('Subscribed with email:', email);
			setEmail('');
		}
	};

	return (
		<div>
			<footer className="bg3 p-t-75 p-b-32">
				<div className="container">
					<div className="row">
						<div className="col-sm-6 col-lg-4 p-b-50">
							<h4 className="stext-301 cl0 p-b-30">{t('help')}</h4>
							<ul>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">
										{t('track_order')}
									</a>
								</li>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">
										{t('returns')}
									</a>
								</li>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">
										{t('shipping')}
									</a>
								</li>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">
										{t('faqs')}
									</a>
								</li>
							</ul>
						</div>
						<div className="col-sm-6 col-lg-4 p-b-50">
							<h4 className="stext-301 cl0 p-b-30">{t('contact_us')}</h4>
							<p className="stext-107 cl7 size-201">{t('contact_info')}</p>
							<div className="p-t-27">
								<a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16" aria-label={t('facebook')}>
									<i className="fa fa-facebook"></i>
								</a>
								<a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16" aria-label={t('instagram')}>
									<i className="fa fa-instagram"></i>
								</a>
								<a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16" aria-label={t('pinterest')}>
									<i className="fa fa-pinterest-p"></i>
								</a>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 p-b-50">
							<h4 className="stext-301 cl0 p-b-30">{t('newsletter')}</h4>
							<form onSubmit={handleSubmit}>
								<div className="wrap-input1 w-full p-b-4">
									<label htmlFor="newsletter-email" className="sr-only">
										{t('email_placeholder')}
									</label>
									<input
										id="newsletter-email"
										className="input1 bg-none plh1 stext-107 cl7"
										type="email"
										name="email"
										placeholder={t('email_placeholder')}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										aria-required="true"
									/>
									<div className="focus-input1 trans-04"></div>
									{error && (
										<p className="text-red-500 text-sm mt-1">{error}</p>
									)}
								</div>
								<div className="p-t-18">
									<button
										type="submit"
										className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04"
									>
										{t('subscribe')}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="p-t-40">
						<div className="flex-c-m flex-w p-b-18">
							<a href="#" className="m-all-1">
								<img src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-01.png`} alt="ICON-PAY" />
							</a>
							<a href="#" className="m-all-1">
								<img src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-02.png`} alt="ICON-PAY" />
							</a>
							<a href="#" className="m-all-1">
								<img src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-03.png`} alt="ICON-PAY" />
							</a>
							<a href="#" className="m-all-1">
								<img src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-04.png`} alt="ICON-PAY" />
							</a>
							<a href="#" className="m-all-1">
								<img src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-05.png`} alt="ICON-PAY" />
							</a>
						</div>
						<p
							className="stext-107 cl6 txt-center"
							dangerouslySetInnerHTML={{
								__html: t('copyright', { year }),
							}}
						/>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Footer;