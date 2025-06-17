import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();

	return (
		<div>
			<footer className="bg3 p-t-75 p-b-32">
				<div className="container">
					<div className="row">
						<div className="col-sm-6 col-lg-4 p-b-50">
							<h4 className="stext-301 cl0 p-b-30">{t('help')}</h4>
							<ul>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">{t('track_order')}</a>
								</li>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">{t('returns')}</a>
								</li>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">{t('shipping')}</a>
								</li>
								<li className="p-b-10">
									<a href="#" className="stext-107 cl7 hov-cl1 trans-04">{t('faqs')}</a>
								</li>
							</ul>
						</div>
						<div className="col-sm-6 col-lg-4 p-b-50">
							<h4 className="stext-301 cl0 p-b-30">{t('contact')}</h4>
							<p className="stext-107 cl7 size-201">{t('contact_info')}</p>
							<div className="p-t-27">
								<a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
									<i className="fa fa-facebook"></i>
								</a>
								<a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
									<i className="fa fa-instagram"></i>
								</a>
								<a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
									<i className="fa fa-pinterest-p"></i>
								</a>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 p-b-50">
							<h4 className="stext-301 cl0 p-b-30">{t('newsletter')}</h4>
							<form>
								<div className="wrap-input1 w-full p-b-4">
									<input
										className="input1 bg-none plh1 stext-107 cl7"
										type="text"
										name="email"
										placeholder={t('email_placeholder')}
									/>
									<div className="focus-input1 trans-04"></div>
								</div>
								<div className="p-t-18">
									<button className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04">
										{t('subscribe')}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="p-t-40">
						<div className="flex-c-m flex-w p-b-18">
							<a href="#" className="m-all-1">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-01.png`}
									alt="ICON-PAY"
								/>
							</a>
							<a href="#" className="m-all-1">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-02.png`}
									alt="ICON-PAY"
								/>
							</a>
							<a href="#" className="m-all-1">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-03.png`}
									alt="ICON-PAY"
								/>
							</a>
							<a href="#" className="m-all-1">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-04.png`}
									alt="ICON-PAY"
								/>
							</a>
							<a href="#" className="m-all-1">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/icons/icon-pay-05.png`}
									alt="ICON-PAY"
								/>
							</a>
						</div>
						<p className="stext-107 cl6 txt-center">
							<Trans
								i18nKey="copyright"
								values={{ year: new Date().getFullYear() }}
								components={{
									heart: <i className="fa fa-heart-o" aria-hidden="true" />,
									colorlib: <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer">Colorlib</a>,
									themewagon: <a href="https://themewagon.com" target="_blank" rel="noopener noreferrer">ThemeWagon</a>,
								}}
							/>
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Footer;