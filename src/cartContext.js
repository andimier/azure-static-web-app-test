import React, { useReducer, useEffect, useContext } from 'react';
import Cart from './Cart';
import cartReducer from './cartReducer';

let initialCart;

try {
    initialCart = JSON.parse(localStorage.getItem("cart")) ?? [];
} catch {
    console.error("Bad data format in storage");
    initialCart = [];
}


const CartContext = React.createContext(null);

export function CartProvider(props) {
    const [cart, dispatch] = useReducer(cartReducer, initialCart);

    useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {props.children}
        </CartContext.Provider>
    );
}

// Custom Hook
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used within a CartProvider. Wrap a parent component in a <CartProvider> to fix this error"
        )
    }

    return context;
}
