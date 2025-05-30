import axios from 'axios';
import i18n from './i18n';

// Add request interceptor to include Accept-Language header
axios.interceptors.request.use(
    (config) => {
        config.headers['Accept-Language'] = i18n.language || 'vi';
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;