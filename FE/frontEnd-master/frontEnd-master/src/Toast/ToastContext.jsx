import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });

        setTimeout(() => {
            setToast({ show: false, message: '', type });
        }, 4000); // auto hide
    };

    const hideToast = () => {
        setToast({ ...toast, show: false });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.show && (
                <Toast message={toast.message} type={toast.type} onClose={hideToast} />
            )}
        </ToastContext.Provider>
    );
};
