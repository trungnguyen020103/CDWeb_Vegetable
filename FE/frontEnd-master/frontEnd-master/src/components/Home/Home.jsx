import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import axios from '../../axiosConfig'; // Use custom axios
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

const Home = () => {
	const { t } = useTranslation();
	const [newProducts, setNewProducts] = useState([]);
	const [banchayproducts, setBanchayproducts] = useState([]);
	const [favoriteProducts, setFavoriteProducts] = useState([]);
	const [loading, setLoading] = useState({ bestSellers: true, newProducts: true, favorites: true });
	const [error, setError] = useState({ bestSellers: null, newProducts: null, favorites: null });

	const slideImages = [
		'assets/images/background_vegeta1.jpg',
		'assets/images/background_vegeta2.jpg',
	];

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProducts = async (categoryId, setProducts, section) => {
			try {
				const response = await axios.get(`http://localhost:8080/api/products/category/${categoryId}`);
				setProducts(response.data);
				setLoading((prev) => ({ ...prev, [section]: false }));
			} catch (err) {
				setError((prev) => ({ ...prev, [section]: t('error_loading') }));
				setLoading((prev) => ({ ...prev, [section]: false }));
			}
		};

		fetchProducts(1, setBanchayproducts, 'bestSellers');
		fetchProducts(2, setNewProducts, 'newProducts');
		fetchProducts(3, setFavoriteProducts, 'favorites');
	}, [t]);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		draggable: true,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
					autoplay: true,
					autoplaySpeed: 3000,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: true,
					autoplaySpeed: 3000,
				},
			},
		],
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
	};

	function SampleNextArrow(props) {
		const { className, style, onClick } = props;
		return (
			<div
				className={className}
				style={{ ...style, display: 'block', right: '-25px' }}
				onClick={onClick}
			/>
		);
	}

	function SamplePrevArrow(props) {
		const { className, style, onClick } = props;
		return (
			<div
				className={className}
				style={{ ...style, display: 'block', left: '-25px', zIndex: 1 }}
				onClick={onClick}
			/>
		);
	}

	const handleShopNowClick = (id) => {
		window.scrollTo(0, 0);
		navigate(`/product/${id}`);
	};

	return (
		<div>
			<section className="section-slide">
				<div className="wrap-slick1">
					<div className="slick1">
						{slideImages.map((image, index) => (
							<div
								className="item-slick1"
								style={{ backgroundImage: `url(${image})` }}
								key={index}
							>
								<div className="container h-full">
									<div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
										<div
											className="layer-slick1 animated visible-false"
											data-appear="fadeInDown"
											data-delay="0"
										>
											<span className="ltext-101 cl2 respon2">{t('shop_vegetables')}</span>
										</div>
										<div
											className="layer-slick1 animated visible-false"
											data-appear="fadeInUp"
											data-delay="800"
										>
											<h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
												{t('quality_safety')}
											</h2>
										</div>
										<div
											className="layer-slick1 animated visible-false"
											data-appear="zoomIn"
											data-delay="1600"
										>
											<Link
												to="/product"
												className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
											>
												{t('shop_now')}
											</Link>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">{t('best_sellers')}</h3>
					</div>
					{loading.bestSellers ? (
						<p>{t('loading')}</p>
					) : error.bestSellers ? (
						<p>{error.bestSellers}</p>
					) : (
						<Slider {...settings}>
							{banchayproducts.map((product) => (
								<div key={product.id} className="wrap-pic-w product-item">
									<div className="block1">
										<img src={product.imageUrl} alt={product.name} />
										<button
											onClick={() => handleShopNowClick(product.id)}
											className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
										>
											<div className="block1-txt-child1 flex-col-l">
												<span className="block1-info stext-102 trans-04">{product.name}</span>
											</div>
											<div className="block1-txt-child2 p-b-4 trans-05">
												<div className="block1-link stext-101 cl0 trans-09">{t('shop_now')}</div>
											</div>
										</button>
									</div>
								</div>
							))}
						</Slider>
					)}
				</div>
			</section>

			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">{t('new_products')}</h3>
					</div>
					{loading.newProducts ? (
						<p>{t('loading')}</p>
					) : error.newProducts ? (
						<p>{error.newProducts}</p>
					) : (
						<Slider {...settings}>
							{newProducts.map((product) => (
								<div key={product.id} className="wrap-pic-w product-item">
									<div className="block1">
										<img src={product.imageUrl} alt={product.name} />
										<button
											onClick={() => handleShopNowClick(product.id)}
											className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
										>
											<div className="block1-txt-child1 flex-col-l">
												<span className="block1-info stext-102 trans-04">{product.name}</span>
											</div>
											<div className="block1-txt-child2 p-b-4 trans-05">
												<div className="block1-link stext-101 cl0 trans-09">{t('shop_now')}</div>
											</div>
										</button>
									</div>
								</div>
							))}
						</Slider>
					)}
				</div>
			</section>

			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">{t('favorite_products')}</h3>
					</div>
					{loading.favorites ? (
						<p>{t('loading')}</p>
					) : error.favorites ? (
						<p>{error.favorites}</p>
					) : (
						<Slider {...settings}>
							{favoriteProducts.map((product) => (
								<div key={product.id} className="wrap-pic-w product-item">
									<div className="block1">
										<img src={product.imageUrl} alt={product.name} />
										<button
											onClick={() => handleShopNowClick(product.id)}
											className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
										>
											<div className="block1-txt-child1 flex-col-l">
												<span className="block1-info stext-102 trans-04">{product.name}</span>
											</div>
											<div className="block1-txt-child2 p-b-4 trans-05">
												<div className="block1-link stext-101 cl0 trans-09">{t('shop_now')}</div>
											</div>
										</button>
									</div>
								</div>
							))}
						</Slider>
					)}
				</div>
			</section>
		</div>
	);
};

export default Home;