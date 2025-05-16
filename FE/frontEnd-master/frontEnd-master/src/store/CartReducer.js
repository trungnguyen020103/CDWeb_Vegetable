// src/store/cartReducer.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY,CLEAR_CART } from './Actions';

const initialState = JSON.parse(localStorage.getItem('cart')) || [];
const cartReducer = (state = initialState, action) => {
    let updatedCart;
    switch (action.type) {
        case ADD_TO_CART:
            const existingProduct = state.find(item => item.id === action.payload.id);
            if (existingProduct) {
                updatedCart = state.map(item =>
                    item.id === action.payload.id
                        ? { id: item.id, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            } else {
                updatedCart = [...state, { id: action.payload.id, quantity: action.payload.quantity }];
            }
            break;
        case REMOVE_FROM_CART:
            updatedCart = state.filter(item => item.id !== action.payload);
            break;
        case UPDATE_QUANTITY:
            const { productId, quantity } = action.payload;
            updatedCart = state.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            );

            break;
        case CLEAR_CART:
            updatedCart = []; // Xóa tất cả sản phẩm trong giỏ hàng
            break;
        default:
            updatedCart = state;
    }

    // Lưu giỏ hàng vào Local Storage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
};

export default cartReducer;
