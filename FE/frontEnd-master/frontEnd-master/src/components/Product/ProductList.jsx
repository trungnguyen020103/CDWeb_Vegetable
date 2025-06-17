import React, { useState, useEffect, useCallback } from 'react';
import './ProductList.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/Actions';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../Toast/ToastContext';

const ProductList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const productsPerPage = 12;

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories');
            console.log('Raw categories response:', response.data);
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.error('Categories data is not an array:', response.data);
                setError(t('invalid_category_data'));
            }
        } catch (error) {
            console.error('Error fetching categories:', error.message);
            setError(t('error_loading_categories'));
        }
    }, [t]);

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
            console.log('Fetching products with params:', params);
            const response = await axios.get('http://localhost:8080/api/products', { params });
            console.log('Raw products response:', response.data);
            if (response.data && Array.isArray(response.data.content)) {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages || 1);
            } else {
                console.error('Products content is not an array:', response.data);
                setError(t('invalid_product_data'));
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
            setError(t('error_loading'));
        } finally {
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, searchQuery, selectedCategory, sortOption, t]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    const formatPrice = (price) => {
        if (typeof price !== 'number' && typeof price !== 'string') {
            console.error('Invalid price:', price);
            return t('not_available');
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number(price));
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddToCart = (product, quantity = 1) => {
        if (!product || !product.id) {
            console.error('Invalid product:', product);
            showToast(t('invalid_product_data'), 'error');
            return;
        }
        dispatch(addToCart({ id: product.id, quantity }));
        showToast(t('add_to_cart_success'), 'success');
    };

    const handleAddToWishlist = (product) => {
        if (product && product.name) {
            showToast(t('add_to_wishlist_success', { name: product.name }), 'success');
        } else {
            console.error('Invalid product:', product);
            showToast(t('invalid_product_data'), 'error');
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
                        aria-label={t('search_products')}
                    />
                </div>
                <div className="header-icons">
                    <a href="/shoppingCart">
                        <button className="icon-btn" aria-label={t('view_cart')}>
                            <span className="cart-icon">🛒</span>
                            <span className="icon-label">{t('cart_label')}</span>
                        </button>
                    </a>
                    <button className="icon-btn" aria-label={t('view_wishlist')}>
                        <span className="heart-icon">❤️</span>
                        <span className="icon-label">{t('wishlist_label')}</span>
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <select onChange={handleCategoryChange} value={selectedCategory} aria-label={t('select_category')}>
                    <option value="">{t('all_categories')}</option>
                    {categories.map((category) => {
                        if (!category || typeof category !== 'object' || !category.id || !category.name) {
                            console.error('Invalid category:', category);
                            return null;
                        }
                        return (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        );
                    })}
                </select>
                <select onChange={handleSortChange} value={sortOption} aria-label={t('select_sort')}>
                    <option value="">{t('sort_by')}</option>
                    <option value="best_selling">{t('best_selling')}</option>
                    <option value="price_asc">{t('price_asc')}</option>
                    <option value="price_desc">{t('price_desc')}</option>
                    <option value="discount">{t('discount')}</option>
                </select>
            </div>

            <h1 className="product-list-title">{t('organic_vegetables')}</h1>

            {isLoading && <p className="loading-message">{t('loading_products')}</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && products.length === 0 && !error && (
                <p>{t('no_products_found')}</p>
            )}

            <div className="product-grid">
                {products.map((product) => {
                    if (!product || typeof product !== 'object' || !product.id || !product.name || !product.price) {
                        console.error('Invalid product:', product);
                        return null;
                    }
                    return (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                    className="product-image"
                                    onError={(e) => {
                                        console.warn(`Failed to load image for ${product.name}: ${product.imageUrl}`);
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="add-to-cart-btn"
                                    aria-label={t('add_to_cart_button', { name: product.name })}
                                >
                                    <span className="cart-icon">🛒</span> {t('add_to_cart_button')}
                                </button>
                            </div>
                            <button
                                onClick={() => handleAddToWishlist(product)}
                                className="wishlist-btn"
                                aria-label={t('add_to_wishlist', { name: product.name })}
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
                    );
                })}
            </div>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    aria-label={t('previous_page')}
                >
                    {t('previous_page')}
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        aria-label={t('page_number', { number: index + 1 })}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    aria-label={t('next_page')}
                >
                    {t('next_page')}
                </button>
            </div>
        </div>
    );
};

export default ProductList;