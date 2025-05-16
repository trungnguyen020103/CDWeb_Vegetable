import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {products} from '../../data/ProductDataFE'; // Sử dụng dữ liệu từ tệp tải lên
// import Pagination from '../Pagination/Pagination';
import ReactSlider from 'react-slider';
import './Product.css';
import './Slider.css';
import {remove as removeDiacritics} from 'diacritics';

// Function to extract unique categories

const Product = () => {
    const [sortOrder, setSortOrder] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const itemsPerPage = 20;

    const navigate = useNavigate();

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
    };

    const handleDetail = (id) => {
        window.scrollTo(0, 0);  // Scroll to the top
        navigate(`/product/${id}`);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when category changes
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    };

    const normalizeText = (text) => {
        return removeDiacritics(text)
            .toLowerCase()
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };

    const doesProductMatchSearchTerm = (productName, searchTerm) => {
        const normalizedProductName = normalizeText(productName);
        const normalizedSearchTerm = normalizeText(searchTerm);
        const searchKeywords = normalizedSearchTerm.split(' ');

        return searchKeywords.every(keyword => normalizedProductName.includes(keyword));
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'priceLowToHigh') {
            return a.price - b.price;
        } else if (sortOrder === 'priceHighToLow') {
            return b.price - a.price;
        }
        return 0;
    });
    const clidckproduct = (id) => {
        window.scrollTo(0, 0);
        // navigate(`/product/${id}`);
        navigate(`/product/1`);
    };
    const filteredProducts = sortedProducts.filter(product => {
        const [min, max] = priceRange;
        if (product.price < min || product.price > max) return false;

        if (selectedCategory !== 'All Products' && product.category !== selectedCategory) {
            return false;
        }

        if (searchTerm && !doesProductMatchSearchTerm(product.name, searchTerm)) {
            return false;
        }

        return true;
    });

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    // Number of categories to show before grouping into dropdown
    const visibleCategoryCount = 3;

    return (
        <div className="bg0 m-t-23 p-b-140">
            <div className="container">
                <div className="flex-w flex-sb-m p-b-52">
                    <div className="flex-w flex-l-m filter-tope-group m-tb-10">
                        <button className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5">
                            Category 1
                        </button>
                        <button className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5">
                            Category 2
                        </button>
                        <div className="dropdown">
                            <button className="dropbtn stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5">
                                Nhiều Hơn
                            </button>
                            <div className="dropdown-content">
                                <a href="#" className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5">
                                    Category 3
                                </a>
                                <a href="#" className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5">
                                    Category 4
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex-w flex-c-m m-tb-10">
                        <div
                            className="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 js-show-filter">
                            <i className="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"></i>
                            <i className="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close"></i>
                            Filter
                        </div>
                    </div>

                    <div className="panel-search p-t-10 p-b-15">
                        <div className="bor8 dis-flex p-l-15">
                            <button className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
                                <i className="zmdi zmdi-search"></i>
                            </button>
                            <input
                                className="mtext-107 cl2 size-114 plh2 p-r-15"
                                type="text"
                                name="search-product"
                                placeholder="Tìm kiếm"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="panel-filter visible">
                    <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
                        <div className="filter-col1 p-r-15 p-b-27">
                            <div className="mtext-102 cl2 p-b-15">Sort By</div>
                            <ul>
                                <li className="p-b-6">
                                    <a href="#" className="filter-link stext-106 trans-04">
                                        Default
                                    </a>
                                </li>
                                <li className="p-b-6">
                                    <a href="#" className="filter-link stext-106 trans-04">
                                        Price: Low to High
                                    </a>
                                </li>
                                <li className="p-b-6">
                                    <a href="#" className="filter-link stext-106 trans-04">
                                        Price: High to Low
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="filter-col2 p-r-15 p-b-27">
                            <div className="mtext-102 cl2 p-b-15">Price</div>
                            <div className="horizontal-slider">
                                <div className="example-track"></div>
                                <div className="example-thumb">
                                    <div className="thumb-value">0</div>
                                    <div className="thumb-circle"></div>
                                </div>
                            </div>
                            <div className="price-range-values">
                                <span>0 VND</span> - <span>10,000,000 VND</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Product Grid */}
                <div className="row isotope-grid">
                    {/* Product 1 */}
                    <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item category1">
                        <div className="block2">
                            <div className="block2-pic hov-img0">
                                <img
                                    src="https://get.pxhere.com/photo/plant-fruit-berry-sweet-summer-ripe-food-red-produce-macro-garden-eat-strawberry-fruits-strawberries-vitamins-benefit-from-strawberry-time-strawberry-plant-fruits-on-the-tree-604592.jpg"
                                    alt="Product 1"/>
                                <button onClick={clidckproduct}
                                    className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                >
                                    Chi tiết
                                </button>
                            </div>
                            <div className="block2-txt flex-w flex-t p-t-14">
                                <div className="block2-txt-child1 flex-col-l ">
                                    <a
                                        href="/product/1"
                                        className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                    >
                                        Sản phẩm 1
                                    </a>
                                    <span className="stext-105 cl3">500,000 VND</span>
                                </div>
                                <div className="block2-txt-child2 flex-r p-t-3">
                                    <a href="" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                        <img
                                            className="icon-heart1 dis-block trans-04"
                                            src="assets/images/icons/icon-heart-01.png"
                                            alt="ICON"
                                        />
                                        <img
                                            className="icon-heart2 dis-block trans-04 ab-t-l"
                                            src="assets/images/icons/icon-heart-02.png"
                                            alt="ICON"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product 2 */}
                    <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item category2">
                        <div className="block2">
                            <div className="block2-pic hov-img0">
                                <img
                                    src="https://get.pxhere.com/photo/plant-fruit-berry-sweet-summer-ripe-food-red-produce-macro-garden-eat-strawberry-fruits-strawberries-vitamins-benefit-from-strawberry-time-strawberry-plant-fruits-on-the-tree-604592.jpg"
                                    alt="Product 2"/>
                                <button
                                    className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                >
                                    Chi tiết
                                </button>
                            </div>
                            <div className="block2-txt flex-w flex-t p-t-14">
                                <div className="block2-txt-child1 flex-col-l ">
                                    <a
                                        href="/product/2"
                                        className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                    >
                                        Sản phẩm 2
                                    </a>
                                    <span className="stext-105 cl3">750,000 VND</span>
                                </div>
                                <div className="block2-txt-child2 flex-r p-t-3">
                                    <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                        <img
                                            className="icon-heart1 dis-block trans-04"
                                            src="assets/images/icons/icon-heart-01.png"
                                            alt="ICON"
                                        />
                                        <img
                                            className="icon-heart2 dis-block trans-04 ab-t-l"
                                            src="assets/images/icons/icon-heart-02.png"
                                            alt="ICON"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product 3 */}
                    <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item category3">
                        <div className="block2">
                            <div className="block2-pic hov-img0">
                                <img
                                    src="https://get.pxhere.com/photo/plant-fruit-berry-sweet-summer-ripe-food-red-produce-macro-garden-eat-strawberry-fruits-strawberries-vitamins-benefit-from-strawberry-time-strawberry-plant-fruits-on-the-tree-604592.jpg"
                                    alt="Product 3"/>
                                <button
                                    className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                >
                                    Chi tiết
                                </button>
                            </div>
                            <div className="block2-txt flex-w flex-t p-t-14">
                                <div className="block2-txt-child1 flex-col-l ">
                                    <a
                                        href="/product/1"
                                        className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                    >
                                        Sản phẩm 3
                                    </a>
                                    <span className="stext-105 cl3">1,000,000 VND</span>
                                </div>
                                <div className="block2-txt-child2 flex-r p-t-3">
                                    <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                        <img
                                            className="icon-heart1 dis-block trans-04"
                                            src="assets/images/icons/icon-heart-01.png"
                                            alt="ICON"
                                        />
                                        <img
                                            className="icon-heart2 dis-block trans-04 ab-t-l"
                                            src="assets/images/icons/icon-heart-02.png"
                                            alt="ICON"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Pagination */}
                <div className="pagination flex-c-m flex-w m-t-50">
                    <a href="#" className="item-pagination flex-c-m trans-04">Prev</a>

                    <a href="#" className="item-pagination flex-c-m trans-04 active-pagination">1</a>
                    <a href="#" className="item-pagination flex-c-m trans-04">2</a>
                    <a href="#" className="item-pagination flex-c-m trans-04">3</a>
                    <a href="#" className="item-pagination flex-c-m trans-04">4</a>
                    <a href="#" className="item-pagination flex-c-m trans-04">5</a>
                    <a href="#" className="item-pagination flex-c-m trans-04">Next</a>
                </div>

            </div>
        </div>
    );
};

export default Product;
