import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import './ProductList.css';

const ProductList = () => {
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
                setError('Dữ liệu danh mục không hợp lệ.');
            }
        } catch (error) {
            console.error('Error fetching categories:', error.message);
            setError('Không thể tải danh mục.');
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                size: productsPerPage,
                search: searchQuery.trim() || null,
                category: selectedCategory || null,
                sort: sortOption || null
            };
            console.log('Fetching products with params:', params);
            const response = await axios.get('http://localhost:8080/api/products', { params });
            console.log('Raw products response:', response.data);
            if (response.data && Array.isArray(response.data.content)) {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages || 1);
            } else {
                console.error('Products content is not an array:', response.data);
                setError('Dữ liệu sản phẩm không hợp lệ.');
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
            setError('Không thể tải sản phẩm. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, searchQuery, selectedCategory, sortOption]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    const formatPrice = (price) => {
        if (typeof price !== 'number' && typeof price !== 'string') {
            console.error('Invalid price:', price);
            return 'N/A';
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(Number(price));
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddToCart = (product) => {
        if (product && product.name) {
            alert(`Đã thêm ${product.name} vào giỏ hàng!`);
        } else {
            console.error('Invalid product:', product);
        }
    };

    const handleAddToWishlist = (product) => {
        if (product && product.name) {
            alert(`Đã thêm ${product.name} vào danh sách yêu thích!`);
        } else {
            console.error('Invalid product:', product);
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
                        placeholder="Tìm kiếm sản phẩm (VD: Rau)..."
                        value={searchQuery}
                        onChange={handleSearch}
                        aria-label="Tìm kiếm sản phẩm"
                    />
                </div>
                <div className="header-icons">
                    <button className="icon-btn" aria-label="Xem giỏ hàng">
                        <span className="cart-icon">🛒</span>
                        <span className="icon-label">Giỏ hàng</span>
                    </button>
                    <button className="icon-btn" aria-label="Xem danh sách yêu thích">
                        <span className="heart-icon">❤️</span>
                        <span className="icon-label">Yêu thích</span>
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <select onChange={handleCategoryChange} value={selectedCategory} aria-label="Chọn danh mục">
                    <option value="">Tất cả danh mục</option>
                    {categories.map(category => {
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
                <select onChange={handleSortChange} value={sortOption} aria-label="Chọn cách sắp xếp">
                    <option value="">Sắp xếp</option>
                    <option value="best_selling">Bán chạy</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="discount">Khuyến mãi</option>
                </select>
            </div>

            <h1 className="product-list-title">Rau Củ Hữu Cơ</h1>

            {isLoading && <p className="loading-message">Đang tải sản phẩm...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && products.length === 0 && !error && (
                <p>Không tìm thấy sản phẩm nào phù hợp.</p>
            )}

            <div className="product-grid">
                {console.log('Rendering products:', products)}
                {products.map(product => {
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
                                    aria-label={`Thêm ${product.name} vào giỏ hàng`}
                                >
                                    <span className="cart-icon">🛒</span> Thêm vào giỏ hàng
                                </button>
                            </div>
                            <button
                                onClick={() => handleAddToWishlist(product)}
                                className="wishlist-btn"
                                aria-label={`Thêm ${product.name} vào danh sách yêu thích`}
                            >
                                <span className="heart-icon">❤️</span>
                            </button>
                            <h3 className="product-name">{product.name}</h3>
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
                    aria-label="Trang trước"
                >
                    Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        aria-label={`Trang ${index + 1}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    aria-label="Trang tiếp theo"
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default ProductList;