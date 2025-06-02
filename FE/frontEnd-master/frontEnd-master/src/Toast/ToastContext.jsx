// ToastProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import './Toast.css'; // import file css vừa tạo

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const showToast = (message, type = 'success') => {
        setToast({ message, type, visible: true });

        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div className="toast-container">
                    <div className="toast-header">
                        <span className="toast-title">Thông báo</span>
                        <div className="toast-header-right">
                            <span className="toast-time">just now</span>
                            <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, visible: false }))}>
                                ×
                            </button>
                        </div>
                    </div>
                    <div className="toast-body">
                        {toast.message}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
