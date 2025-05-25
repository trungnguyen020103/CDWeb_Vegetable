import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import './ProductList.css';

const ProductList = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [categoriesError, setCategoriesError] = useState(null);
    const productsPerPage = 12;

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get('/api/categories', {
                headers: { 'Accept-Language': i18n.language },
            });
            if (Array.isArray(response.data)) {
                setCategories(response.data);
                setCategoriesError(null);
            } else {
                setCategoriesError(t('error_loading_categories'));
            }
        } catch (error) {
            setCategoriesError(t('error_loading_categories'));
        }
    }, [t, i18n.language]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                size: productsPerPage,
                search: searchQuery.trim() || null,
                category: selectedCategory || null,
                sort: sortOption || null,
            };
            const response = await axios.get('/api/products', {
                params,
                headers: { 'Accept-Language': i18n.language },
            });
            if (response.data && Array.isArray(response.data.content)) {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages || 1);
                setProductsError(null);
            } else {
                setProductsError(t('error_loading_products'));
            }
        } catch (error) {
            setProductsError(t('error_loading_products'));
        } finally {
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, searchQuery, selectedCategory, sortOption, t, i18n.language]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    useEffect(() => {
        console.log('Language changed to:', i18n.language);
    }, [i18n.language]);

    const formatPrice = (price) => {
        if (typeof price !== 'number' && typeof price !== 'string') {
            return 'N/A';
        }
        let numericPrice;
        if (typeof price === 'string') {
            numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        } else {
            numericPrice = Number(price);
        }
        if (isNaN(numericPrice)) {
            return 'N/A';
        }
        const currency = i18n.language === 'vi' ? 'VND' : 'USD';
        return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: currency,
        }).format(numericPrice);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddToCart = (product) => {
        if (product && product.name) {
            alert(t('added_to_cart', { name: product.name }));
        }
    };

    const handleAddToWishlist = (product) => {
        if (product && product.name) {
            alert(t('added_to_wishlist', { name: product.name }));
        }
    };

    const debouncedSearch = debounce((value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, 300);

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="product-list-container">
            <div className="header-controls">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchQuery}
                        onChange={handleSearch}
                        aria-label={t('search_placeholder')}
                    />
                </div>
                <div className="header-icons">
                    <button className="icon-btn" aria-label={t('cart')}>
                        <span className="cart-icon">🛒</span>
                        <span className="icon-label">{t('cart')}</span>
                    </button>
                    <button className="icon-btn" aria-label={t('add_to_wishlist')}>
                        <span className="heart-icon">❤️</span>
                        <span className="icon-label">{t('add_to_wishlist')}</span>
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <select onChange={handleCategoryChange} value={selectedCategory} aria-label={t('all_categories')}>
                    <option value="">{t('all_categories')}</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select onChange={handleSortChange} value={sortOption} aria-label={t('sort_by')}>
                    <option value="">{t('sort_by')}</option>
                    <option value="best_selling">{t('sort_best_selling')}</option>
                    <option value="price_asc">{t('sort_price_asc')}</option>
                    <option value="price_desc">{t('sort_price_desc')}</option>
                    <option value="discount">{t('sort_discount')}</option>
                </select>
            </div>

            <h1 className="product-list-title">{t('organic_vegetables')}</h1>

            {categoriesError && <p className="error-message">{categoriesError}</p>}
            {isLoading && <p className="loading-message">{t('loading_products')}</p>}
            {productsError && <p className="error-message">{productsError}</p>}
            {!isLoading && products.length === 0 && !productsError && <p>{t('no_products_found')}</p>}

            <div className="product-grid">
                {products.map((product) => (
                    product && product.id && product.name && product.imageUrl ? (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                    className="product-image"
                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                />
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="add-to-cart-btn"
                                    aria-label={t('add_to_cart')}
                                >
                                    <span className="cart-icon">🛒</span> {t('add_to_cart')}
                                </button>
                            </div>
                            <button
                                onClick={() => handleAddToWishlist(product)}
                                className="wishlist-btn"
                                aria-label={t('add_to_wishlist')}
                            >
                                <span className="heart-icon">❤️</span>
                            </button>
                            <h3 className="product-name">
                                <Link to={`/product/${product.id}`} className="product-link">
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="product-price">{formatPrice(product.price)}</p>
                        </div>
                    ) : null
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    aria-label={t('previous')}
                >
                    {t('previous')}
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        aria-label={`Page ${index + 1}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    aria-label={t('next')}
                >
                    {t('next')}
                </button>
            </div>
        </div>
    );
};

export default ProductList;