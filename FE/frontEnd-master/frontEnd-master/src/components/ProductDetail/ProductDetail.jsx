import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css'; // Import custom CSS

export default function ProductDetail() {
    const { id } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);

    // Lấy chi tiết sản phẩm từ backend
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

    // Xử lý tăng số lượng
    const handleIncreaseQuantity = () => {
        if (quantity < product?.stock) {
            setQuantity(quantity + 1);
        }
    };

    // Xử lý giảm số lượng
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="loading-message">Đang tải...</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-card">
                <div className="product-grid">
                    {/* Hình ảnh sản phẩm */}
                    <div className="product-image-wrapper">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="product-image"
                        />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="product-details">
                        {/* Tên sản phẩm */}
                        <h1 className="product-name">{product.name}</h1>

                        {/* Giá tiền */}
                        <div className="product-price">{product.price.toLocaleString('vi-VN')}đ</div>

                        {/* Số lượng sản phẩm còn lại */}
                        <div className="product-stock">
                            <span>Còn {product.stock} sản phẩm</span>
                        </div>

                        {/* Mô tả sản phẩm */}
                        <div className="product-description">
                            <h2>Mô tả sản phẩm</h2>
                            <p>{product.description}</p>
                        </div>

                        {/* Nút tăng/giảm số lượng */}
                        <div className="quantity-section">
                            <label className="quantity-label">Số lượng:</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={handleDecreaseQuantity}
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
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
                                    className="quantity-input"
                                />
                                <button
                                    onClick={handleIncreaseQuantity}
                                    disabled={quantity >= product.stock}
                                    className="quantity-btn"
                                >
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