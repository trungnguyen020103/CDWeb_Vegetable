import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import { addToCart } from "../../store/Actions";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { useToast } from '../../Toast/ToastContext';

export default function ProductDetail() {
    const { t } = useTranslation();
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
                setError(t('product_not_found'));
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/comments/product/${id}`);
                setComments(response.data);
            } catch (err) {
                console.error('Lỗi khi tải bình luận:', err);
                showToast(t('comment_error'), 'error');
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
                showToast(t('review_error'), 'error');
            }
        };
        fetchReviews();
        fetchProduct();
        fetchComments();
    }, [id, showToast, t, token]);

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

    const handleAddToCart = (product, quantity) => {
        if (!product || !product.id) {
            showToast(t('product_not_found'), 'error');
            return;
        }
        dispatch(addToCart({ id: product.id, quantity }));
        setQuantity(1);
        showToast(t('add_to_cart_success'), 'success');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!token || !idUser) {
            showToast(t('login_to_comment'), 'error');
            navigate('/login');
            return;
        }
        if (!newComment.trim()) {
            showToast(t('comment_empty'), 'error');
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
            showToast('Thành công, vui lòng đợi duyệt', 'success');
        } catch (err) {
            const errorMessage =
                err.response?.data && typeof err.response.data === 'object'
                    ? Object.values(err.response.data).join(', ')
                    : err.response?.data || t('comment_error');
            showToast(errorMessage, 'error');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComments(comments.filter(comment => comment.id !== commentId));
            showToast(t('delete_comment_success'), 'success');
        } catch (err) {
            const errorMessage =
                err.response?.data || t('delete_comment_error');
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
        return <div className="detail-loading-message">{t('product_loading')}</div>;
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
                    <div className="detail-product-image-wrapper">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="detail-product-image"
                        />
                    </div>

                    <div className="detail-product-details">
                        <h1 className="detail-product-name">{product.name}</h1>
                        <div className="detail-product-price">{t('price_per_kg', { price: product.price.toLocaleString('vi-VN') })}</div>
                        <div className="detail-product-stock">
                            <span>{t('stock_available', { stock: product.stock })}</span>
                        </div>
                        <div className="detail-quantity-section">
                            <label className="detail-quantity-label">{t('quantity')}</label>
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
                            {t('add_to_cart')}
                        </button>
                    </div>

                    <div className="detail-product-description">
                        <h2>{t('product_description')}</h2>
                        <p>{product.description || t('no_description')}</p>
                    </div>

                    <div className="scrollable-review-frame">
                        <div className="detail-review-section">
                            <h2>{t('product_reviews')}</h2>
                            <div className="detail-review-list">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="detail-review-item">
                                            <div className="detail-review-header">
                                                <span className="detail-review-user">{t('user_label', { userId: review.userId })}</span>
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
                                    <p>{t('no_reviews')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="detail-comment-section">
                        <h2>{t('comments')}</h2>
                        {token && idUser ? (
                            <form onSubmit={handleCommentSubmit} className="detail-comment-form">
                                <textarea
                                    className="detail-comment-input"
                                    placeholder={t('comment_placeholder')}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    maxLength={1000}
                                />
                                <button type="submit" className="detail-comment-submit-btn">
                                    {t('submit_comment')}
                                </button>
                            </form>
                        ) : (
                            <p className="detail-comment-login-prompt">
                                <Trans i18nKey="login_to_comment" components={{ 1: <a href="/login" /> }} />
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
                                                    {t('delete_comment')}
                                                </button>
                                            )}
                                        </div>
                                        <p className="detail-comment-content">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p>{t('no_comments')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}