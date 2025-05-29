import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import {addToCart} from "../../store/Actions";
import {useDispatch} from "react-redux";
import { useToast } from '../../Toast/ToastContext';
export default function ProductDetail() {
    const { showToast } = useToast();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    // Fetch product details from backend
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                setProduct({
                    id: response.data.id,
                    name: response.data.name,
                    price: response.data.price,
                    stock: response.data.stock,
                    imageUrl: response.data.imageUrl,
                    description: response.data.description,
                });
            } catch (err) {
                setError('Không tìm thấy sản phẩm');
            }
        };

        fetchProduct();
    }, [id]);

    // Handle quantity increase
    const handleIncreaseQuantity = () => {
        if (quantity < product?.stock) {
            setQuantity(quantity + 1);
        }
    };

    // Handle quantity decrease
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = (product, quantity ) => {
        if (!product || !product.id) {
            console.error('Invalid product:', product);
            return;
        }
        dispatch(addToCart({ id: product.id, quantity }));
        setQuantity(1);
        showToast('Thêm sản phẩm thành công!', 'success');
    };

    if (error) {
        return <div className="detail-error-message">{error}</div>;
    }

    if (!product) {
        return <div className="detail-loading-message">Đang tải...</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="detail-product-card">
                <div className="detail-product-grid">
                    {/* Product image */}
                    <div className="detail-product-image-wrapper">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="detail-product-image"
                        />
                    </div>

                    {/* Product details and quantity selector */}
                    <div className="detail-product-details">
                        {/* Product name */}
                        <h1 className="detail-product-name">{product.name}</h1>

                        {/* Price */}
                        <div className="detail-product-price">{product.price.toLocaleString('vi-VN')}đ/1kg</div>

                        {/* Stock */}
                        <div className="detail-product-stock">
                            <span>Còn {product.stock} sản phẩm</span>
                        </div>

                        {/* Quantity selector */}
                        <div className="detail-quantity-section">
                            <label className="detail-quantity-label">Số lượng:</label>
                            <div className="detail-quantity-controls">
                                <button
                                    onClick={handleDecreaseQuantity}
                                    disabled={quantity <= 1}
                                    className="detail-quantity-btn"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.min(
                                                Math.max(1, parseInt(e.target.value) || 1),
                                                product.stock
                                            )
                                        )
                                    }
                                    className="detail-quantity-input"
                                />
                                <button
                                    onClick={handleIncreaseQuantity}
                                    disabled={quantity >= product.stock}
                                    className="detail-quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to cart button */}
                        <button
                            className="detail-add-to-cart-btn"
                            onClick={() => handleAddToCart(product, quantity)}
                            disabled={product.stock === 0}
                        >
                            <span className="detail-cart-icon">🛒</span>
                            Thêm vào giỏ hàng
                        </button>
                    </div>

                    {/* Product description */}
                    <div className="detail-product-description">
                        <h2>Mô tả sản phẩm</h2>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}