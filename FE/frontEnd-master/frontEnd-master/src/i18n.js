import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Fallback translations
const resources = {
    en: {
        translation: {
            // Header
            free_shipping: 'Free shipping for standard orders over $100',
            help_faqs: 'Help & FAQs',
            my_account: 'My Account',
            register: 'Register',
            login: 'Login',
            home: 'Home',
            shop: 'Shop',
            cart: 'Cart',
            about: 'About',
            // Home
            shop_vegetables: 'Vegetable Shop',
            quality_safety: 'Guaranteed quality, safety',
            shop_now: 'Shop Now',
            best_sellers: 'BEST SELLERS',
            new_products: 'NEW PRODUCTS',
            favorite_products: 'FAVORITE PRODUCTS',
            // Footer
            help: 'HELP',
            track_order: 'Track Order',
            returns: 'Returns',
            shipping: 'Shipping',
            faqs: 'FAQs',
            contact: 'CONTACT',
            contact_info: 'Any questions? Let us know at the store on the 8th floor, 379 Hudson St, New York, NY 10018 or call us at (+1) 96 716 6879',
            newsletter: 'NEWSLETTER',
            subscribe: 'SUBSCRIBE',
            email_placeholder: 'email@example.com',
            // Login
            email_notblank: 'Email cannot be blank',
            email_invalid: 'Invalid email format',
            password_notblank: 'Password cannot be blank',
            password_invalid_format: 'Password must contain at least 1 uppercase letter, 1 digit, 1 special character',
            login_failed: 'Login failed',
            login_success: 'Login successful',
            // Order
            order_history: 'Order History',
            no_orders: 'You have no orders.',
            loading: 'Loading...',
            error_loading: 'Failed to load orders. Please try again.',
            cancel_order: 'Cancel Order',
            confirm_cancel: 'Are you sure you want to cancel this order?',
            view_details: 'View Details',
            order_details: 'Order Details',
        },
    },
    vi: {
        translation: {
            // Header
            free_shipping: 'Miễn phí vận chuyển cho đơn hàng tiêu chuẩn trên $100',
            help_faqs: 'Trợ giúp & Câu hỏi thường gặp',
            my_account: 'Tài Khoản Của Tôi',
            register: 'Đăng kí',
            login: 'Đăng nhập',
            home: 'Trang chủ',
            shop: 'Cửa hàng',
            cart: 'Giỏ hàng',
            about: 'Giới Thiệu',
            // Home
            shop_vegetables: 'Shop rau củ quả',
            quality_safety: 'Đảm bảo chất lượng, an toàn',
            shop_now: 'Vào Cửa Hàng Ngay',
            best_sellers: 'BÁN CHẠY NHẤT',
            new_products: 'SẢN PHẨM MỚI',
            favorite_products: 'SẢN PHẨM YÊU THÍCH',
            // Footer
            help: 'GIÚP ĐỠ',
            track_order: 'Theo dõi thứ tự',
            returns: 'Trả lại',
            shipping: 'Đang chuyển hàng',
            faqs: 'Câu hỏi thường gặp',
            contact: 'LIÊN LẠC',
            contact_info: 'Có thắc mắc gì không? Hãy cho chúng tôi biết tại cửa hàng ở tầng 8, 379 Hudson St, New York, NY 10018 hoặc gọi cho chúng tôi theo số (+1) 96 716 6879',
            newsletter: 'BẢN TIN',
            subscribe: 'ĐẶT MUA',
            email_placeholder: 'email@example.com',
            // Login
            email_notblank: 'Email không được để trống',
            email_invalid: 'Email không hợp lệ',
            password_notblank: 'Mật khẩu không được để trống',
            password_invalid_format: 'Mật khẩu phải chứa ít nhất 1 chữ cái in hoa, 1 số, 1 ký tự đặc biệt',
            login_failed: 'Đăng nhập thất bại',
            login_success: 'Đăng nhập thành công',
            // Order
            order_history: 'Lịch Sử Đơn Hàng',
            no_orders: 'Bạn chưa có đơn hàng nào.',
            loading: 'Đang tải...',
            error_loading: 'Không thể tải đơn hàng. Vui lòng thử lại.',
            cancel_order: 'Hủy Đơn Hàng',
            confirm_cancel: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            view_details: 'Xem Chi Tiết',
            order_details: 'Chi Tiết Đơn Hàng',
        },
    },
};

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources, // Local translations as fallback
        fallbackLng: 'vi',
        lng: 'vi', // Default language
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false, // React handles XSS
        },
        backend: {
            loadPath: 'http://localhost:8080/api/messages',
            addPath: 'http://localhost:8080/api/messages',
            parse: (data) => JSON.parse(data), // Parse JSON response
            requestOptions: {
                headers: {
                    'Accept-Language': '{{lng}}', // Dynamic language header
                },
            },
        },
        detection: {
            order: ['localStorage', 'navigator', 'querystring'],
            lookupLocalStorage: 'i18nextLng',
        },
    });

export default i18n;