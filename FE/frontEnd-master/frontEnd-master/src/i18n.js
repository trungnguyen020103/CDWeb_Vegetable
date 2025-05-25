// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            // Các key đã có từ trước
            welcome: 'Welcome to our app!',
            free_shipping: 'Free shipping for standard orders over $100',
            help_faqs: 'Help & FAQs',
            my_account: 'My Account',
            register: 'Register',
            login: 'Login',
            logout: 'Logout',
            home: 'Home',
            shop: 'Shop',
            cart: 'Cart',
            about: 'About',
            contact: 'Contact',
            currency: 'USD',
            help: 'Help',
            track_order: 'Track Order',
            returns: 'Returns',
            shipping: 'Shipping',
            faqs: 'FAQs',
            contact_us: 'Contact Us',
            contact_info: 'Got questions? Let us know in-store at 8th floor, 379 Hudson St, New York, NY 10018 or call us at (+1) 96 716 6879',
            newsletter: 'Newsletter',
            subscribe: 'Subscribe',
            email_placeholder: 'email@example.com',
            copyright: 'Copyright ©{{year}} All rights reserved | Made with <3 by <a href="https://colorlib.com" target="_blank">Colorlib</a> & distributed by <a href="https://themewagon.com" target="_blank">ThemeWagon</a>',
            shop_vegetables: 'Vegetable Shop',
            quality_safety: 'Guaranteed quality, safety',
            shop_now: 'Shop Now',
            best_selling: 'Best Selling',
            new_products: 'New Products',
            top_favorites: 'Top Favorites',
            facebook: 'Facebook',
            instagram: 'Instagram',
            pinterest: 'Pinterest',
            email_invalid: 'Invalid email address',
            error: 'Error',
            // Thêm các key mới cho Home.jsx
            loading_best_sellers: 'Loading best sellers...',
            loading_new_products: 'Loading new products...',
            loading_favorite_products: 'Loading favorite products...',
            error_loading_categories: 'Error loading categories',
            error_loading_products: 'Error loading products',
        },
    },
    vi: {
        translation: {
            // Các key đã có từ trước
            welcome: 'Chào mừng đến với ứng dụng của chúng tôi!',
            free_shipping: 'Miễn phí vận chuyển cho đơn hàng tiêu chuẩn trên 100.000 VNĐ',
            help_faqs: 'Trợ giúp & Câu hỏi thường gặp',
            my_account: 'Tài khoản của tôi',
            register: 'Đăng ký',
            login: 'Đăng nhập',
            logout: 'Đăng xuất',
            home: 'Trang chủ',
            shop: 'Cửa hàng',
            cart: 'Giỏ hàng',
            about: 'Giới thiệu',
            contact: 'Liên hệ',
            currency: 'VNĐ',
            help: 'Giúp đỡ',
            track_order: 'Theo dõi đơn hàng',
            returns: 'Trả hàng',
            shipping: 'Vận chuyển',
            faqs: 'Câu hỏi thường gặp',
            contact_us: 'Liên lạc',
            contact_info: 'Có thắc mắc? Hãy cho chúng tôi biết tại cửa hàng ở tầng 8, 379 Hudson St, New York, NY 10018 hoặc gọi (+1) 96 716 6879',
            newsletter: 'Bản tin',
            subscribe: 'Đặt mua',
            email_placeholder: 'email@example.com',
            copyright: 'Bản quyền ©{{year}} Bảo lưu mọi quyền | Được thực hiện với <3 bởi <a href="https://colorlib.com" target="_blank">Colorlib</a> & phân phối bởi <a href="https://themewagon.com" target="_blank">ThemeWagon</a>',
            shop_vegetables: 'Shop rau củ quả',
            quality_safety: 'Đảm bảo chất lượng, an toàn',
            shop_now: 'Vào cửa hàng ngay',
            best_selling: 'Bán chạy nhất',
            new_products: 'Sản phẩm mới',
            top_favorites: 'Sản phẩm yêu thích',
            facebook: 'Facebook',
            instagram: 'Instagram',
            pinterest: 'Pinterest',
            email_invalid: 'Địa chỉ email không hợp lệ',
            error: 'Lỗi',
            // Thêm các key mới cho Home.jsx
            loading_best_sellers: 'Đang tải sản phẩm bán chạy...',
            loading_new_products: 'Đang tải sản phẩm mới...',
            loading_favorite_products: 'Đang tải sản phẩm yêu thích...',
            error_loading_categories: 'Lỗi khi tải danh mục',
            error_loading_products: 'Lỗi khi tải sản phẩm',
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })
    .then(() => {
        console.log('i18n initialized successfully');
    })
    .catch((err) => {
        console.error('i18n initialization failed:', err);
    });

export default i18n;