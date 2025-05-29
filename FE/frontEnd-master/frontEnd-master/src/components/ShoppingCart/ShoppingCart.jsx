import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCart, removeFromCart, updateQuantity } from '../../store/Actions';
import axios from 'axios';
import { useToast } from '../../Toast/ToastContext';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleCheckboxChange = (id) => {
        setSelectedIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const productPromises = cart.map(async (item) => {
                    const response = await axios.get(`http://localhost:8080/api/products/${item.id}`);
                    return { ...response.data, quantity: item.quantity };
                });
                const fetchedProducts = await Promise.all(productPromises);
                setProducts(fetchedProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        dispatch(loadCart());
        if (cart.length > 0) {
            fetchProducts();
        } else {
            setProducts([]);
        }
    }, [dispatch, cart]);

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
        showToast('Xóa thành công sản phẩm', 'success');
    };

    const handleQuantityChange = (productId, newQuantity) => {
        dispatch(updateQuantity(productId, newQuantity));
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            )
        );
    };

    const handleCheckout = () => {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.");
            return;
        }

        // Lọc danh sách sản phẩm được chọn
        const selectedProducts = products.filter((product) => selectedIds.includes(product.id));

        // Truyền danh sách sản phẩm được chọn qua navigate
        navigate('/payment', { state: { selectedProducts } });
    };

    return (
        <div>
            {/* Giữ nguyên phần header cart */}
            <div className="wrap-header-cart js-panel-cart">
                <div className="s-full js-hide-cart"></div>
                <div className="header-cart flex-col-l p-l-65 p-r-25">
                    <div className="header-cart-title flex-w flex-sb-m p-b-8">
                        <span className="mtext-103 cl2">Your Cart</span>
                        <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
                            <i className="zmdi zmdi-close"></i>
                        </div>
                    </div>
                    <div className="header-cart-content flex-w js-pscroll">
                        <ul className="header-cart-wrapitem w-full">
                            {products.map((product) => (
                                <li key={product.id} className="header-cart-item flex-w flex-t m-b-12">
                                    <div className="header-cart-item-img">
                                        <img
                                            src={product.imageUrl || 'assets/images/placeholder.jpg'}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="header-cart-item-txt p-t-8">
                                        <a href="#" className="header-cart-item-name m-b-18 hov-cl1 trans-04">
                                            {product.name}
                                        </a>
                                        <span className="header-cart-item-info">
                      {product.quantity} x {product.price.toLocaleString()} VNĐ
                    </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="w-full">
                            <div className="header-cart-total w-full p-tb-40">
                                Total:{' '}
                                {products
                                    .reduce((total, product) => total + product.price * product.quantity, 0)
                                    .toLocaleString()}{' '}
                                VNĐ
                            </div>
                            <div className="header-cart-buttons flex-w w-full">
                                <a
                                    href="/shoping-cart"
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
                                >
                                    View Cart
                                </a>
                                <a
                                    href="/shoping-cart"
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
                                >
                                    Check Out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                    <a href="index.html" className="stext-109 cl8 hov-cl1 trans-04">
                        Trang Chủ
                        <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                    </a>
                    <span className="stext-109 cl4">Giỏ Hàng</span>
                </div>
            </div>

            <form className="bg0 p-t-75 p-b-85">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-xl-10 m-lr-auto m-b-50">
                            <div className="m-l-25 m-r--38 m-lr-0-xl">
                                <div className="wrap-table-shopping-cart">
                                    <table className="table-shopping-cart">
                                        <thead>
                                        <tr className="table_head">
                                            <th className="column-1">Sản phẩm</th>
                                            <th className="column-2"></th>
                                            <th></th>
                                            <th></th>
                                            <th className="column-3">Giá</th>
                                            <th className="column-4">Số Lượng</th>
                                            <th className="column-5">Tổng Tiền</th>
                                            <th className="column-5">Hành Động</th>
                                            <th className="column-5">Chọn</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loading && (
                                            <tr>
                                                <td colSpan="8">Loading...</td>
                                            </tr>
                                        )}
                                        {error && (
                                            <tr>
                                                <td colSpan="8">Error: {error}</td>
                                            </tr>
                                        )}
                                        {!loading && !error && products.length === 0 && (
                                            <tr>
                                                <td colSpan="8">Your cart is empty</td>
                                            </tr>
                                        )}
                                        {products.map((product) => (
                                            <tr key={product.id} className="table_row">
                                                <td className="column-1">
                                                    <div className="how-itemcart1">
                                                        <img
                                                            src={product.imageUrl || 'assets/images/placeholder.jpg'}
                                                            alt={product.name}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="column-2">{product.name}</td>
                                                <td></td>
                                                <td></td>
                                                <td className="column-3">{product.price.toLocaleString()} VNĐ</td>
                                                <td className="column-4">
                                                    <div className="wrap-num-product flex-w m-l-auto m-r-0">
                                                        <div
                                                            className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    product.id,
                                                                    Math.max(1, product.quantity - 1)
                                                                )
                                                            }
                                                        >
                                                            <i className="fs-16 zmdi zmdi-minus"></i>
                                                        </div>
                                                        <input
                                                            className="mtext-104 cl3 txt-center num-product"
                                                            type="number"
                                                            name="num-product"
                                                            value={product.quantity}
                                                            readOnly
                                                        />
                                                        <div
                                                            className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                                            onClick={() =>
                                                                handleQuantityChange(product.id, product.quantity + 1)
                                                            }
                                                        >
                                                            <i className="fs-16 zmdi zmdi-plus"></i>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="column-5">
                                                    {(product.price * product.quantity).toLocaleString()} VNĐ
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleRemoveFromCart(product.id)}
                                                        type="button"
                                                        className="btn btn-success"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="p-t-8 p-l-10">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(product.id)}
                                                            onChange={() => handleCheckboxChange(product.id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                                    <div className="flex-w flex-m m-r-20 m-tb-5">
                                        {/* Coupon input */}
                                    </div>
                                    <div className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10">
                                        <button
                                            type="button"
                                            onClick={handleCheckout}
                                            className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10"
                                        >
                                            Thanh Toán
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div className="btn-back-to-top" id="myBtn">
        <span className="symbol-btn-back-to-top">
          <i className="zmdi zmdi-chevron-up"></i>
        </span>
            </div>
        </div>
    );
};

export default ShoppingCart;