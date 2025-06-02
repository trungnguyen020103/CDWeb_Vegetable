import React from 'react';
import './Toast.css';
const Toast = ({ message, type = 'success', onClose }) => {
    return (
        <div className={`toast ${type}`} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    );
};
export default Toast;
