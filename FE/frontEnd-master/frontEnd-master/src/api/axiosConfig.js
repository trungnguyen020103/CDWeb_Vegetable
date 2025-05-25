import axios from 'axios';
import i18n from '../i18n';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.language;
    return config;
});

export default instance;