import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import { addToCart } from "../../store/Actions";
import { useDispatch } from "react-redux";
import { useToast } from '../../Toast/ToastContext';

export default function ProductDetail() {
    const { showToast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const dispatch = useDispatch();
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('accessToken');
    const [reviews, setReviews] = useState([]);
    // Fetch product details and comments
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

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/comments/product/${id}`);
                setComments(response.data);
            } catch (err) {
                console.error('Lỗi khi tải bình luận:', err);
                showToast('Không thể tải bình luận', 'error');
            }
        };
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/user/review/product/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setReviews(response.data);
            } catch (err) {
                console.error('Lỗi khi tải đánh giá:', err);
                showToast('Không thể tải đánh giá', 'error');
            }
        };
        fetchReviews();
        fetchProduct();
        fetchComments();
    }, [id, showToast]);

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

    // Handle add to cart
    const handleAddToCart = (product, quantity) => {
        if (!product || !product.id) {
            showToast('Sản phẩm không hợp lệ', 'error');
            return;
        }
        dispatch(addToCart({ id: product.id, quantity }));
        setQuantity(1);
        showToast('Thêm sản phẩm thành công!', 'success');
    };

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!token || !idUser) {
            showToast('Vui lòng đăng nhập để bình luận', 'error');
            navigate('/login');
            return;
        }
        if (!newComment.trim()) {
            showToast('Nội dung bình luận không được để trống', 'error');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/comments',
                {
                    content: newComment,
                    productId: parseInt(id),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewComment('');
            showToast(response.data.message || 'Bình luận đã được gửi và đang chờ duyệt', 'success');
        } catch (err) {
            const errorMessage =
                err.response?.data && typeof err.response.data === 'object'
                    ? Object.values(err.response.data).join(', ')
                    : err.response?.data || 'Lỗi khi đăng bình luận';
            showToast(errorMessage, 'error');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComments(comments.filter(comment => comment.id !== commentId));
            showToast('Xóa bình luận thành công!', 'success');
        } catch (err) {
            const errorMessage =
                err.response?.data || 'Lỗi khi xóa bình luận';
            showToast(errorMessage, 'error');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    if (error) {
        return <div className="detail-error-message">{error}</div>;
    }

    if (!product) {
        return <div className="detail-loading-message">Đang tải...</div>;
    }
    const renderStars = (rating) => {
        return (
            <div className="detail-review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`fa fa-star ${star <= rating ? 'checked' : ''}`}
                    ></span>
                ))}
            </div>
        );
    };

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
                        <h1 className="detail-product-name">{product.name}</h1>
                        <div className="detail-product-price">{product.price.toLocaleString('vi-VN')}đ/1kg</div>
                        <div className="detail-product-stock">
                            <span>Còn {product.stock} sản phẩm</span>
                        </div>
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
                        <p>{product.description || 'Chưa có mô tả.'}</p>
                    </div>
                    {/* Review section */}
                    <div className="scrollable-review-frame">
                        <div className="detail-review-section">
                            <h2>Đánh giá sản phẩm</h2>
                            <div className="detail-review-list">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="detail-review-item">
                                            <div className="detail-review-header">
                                                <span className="detail-review-user">Người dùng #{review.userId}</span>
                                                <span className="detail-review-time">
                                {new Date(review.date).toLocaleString('vi-VN')}
                            </span>
                                            </div>
                                            <div className="detail-review-rating">
                                                {renderStars(review.rating)}
                                            </div>
                                            <p className="detail-review-content">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Chưa có đánh giá nào.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Comment section */}
                    <div className="detail-comment-section">
                        <h2>Bình luận</h2>
                        {token && idUser ? (
                            <form onSubmit={handleCommentSubmit} className="detail-comment-form">
                                <textarea
                                    className="detail-comment-input"
                                    placeholder="Viết bình luận của bạn..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    maxLength={1000}
                                />
                                <button type="submit" className="detail-comment-submit-btn">
                                    Gửi bình luận
                                </button>
                            </form>
                        ) : (
                            <p className="detail-comment-login-prompt">
                                Vui lòng <a href="/login">đăng nhập</a> để bình luận.
                            </p>
                        )}
                        <div className="detail-comment-list">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.id} className="detail-comment-item">
                                        <div className="detail-comment-header">
                                            <span className="detail-comment-user">{comment.userFullname}</span>
                                            <span className="detail-comment-time">{comment.createdAt}</span>
                                            {comment.userId === parseInt(idUser) && (
                                                <button
                                                    className="detail-comment-delete-btn"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                        <p className="detail-comment-content">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có bình luận nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}