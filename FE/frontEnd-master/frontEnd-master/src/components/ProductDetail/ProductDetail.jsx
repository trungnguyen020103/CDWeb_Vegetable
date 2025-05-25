import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProductDetail.css';

export default function ProductDetail() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct({
                    id: response.data.id,
                    name: response.data.name,
                    price: response.data.price,
                    stock: response.data.stock,
                    imageUrl: response.data.imageUrl,
                    description: response.data.description,
                });
            } catch (err) {
                setError(t('product_not_found', { id }));
            }
        };
        fetchProduct();
    }, [id, t]);

    const handleIncreaseQuantity = () => {
        if (quantity < product?.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="loading-message">{t('loading')}</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-card">
                <div className="product-grid">
                    <div className="product-image-wrapper">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="product-image"
                        />
                    </div>

                    <div className="product-details">
                        <h1 className="product-name">{product.name}</h1>
                        <div className="product-price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                        <div className="product-stock">
                            <span>{t('stock', { stock: product.stock })}</span>
                        </div>
                        <div className="product-description">
                            <h2>{t('description')}</h2>
                            <p>{product.description}</p>
                        </div>
                        <div className="quantity-section">
                            <label className="quantity-label">{t('quantity')}:</label>
                            <div className="quantity-controls">
                                <button onClick={handleDecreaseQuantity} disabled={quantity <= 1} className="quantity-btn">
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                                    className="quantity-input"
                                />
                                <button onClick={handleIncreaseQuantity} disabled={quantity >= product.stock} className="quantity-btn">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}