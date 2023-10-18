import React, { useState, useEffect, useReducer } from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import { Routes, Route } from "react-router-dom";
import Cart from "./Cart";
import Detail from "./Detail";
import Checkout from "./Checkout.hook.form.jsx";

// REACT HOOK FOR
import { FormProvider } from "react-hook-form";

/*
  	Movido a Context
	let initialCart;

	try {
		initialCart = JSON.parse(localStorage.getItem("cart")) ?? [];
	} catch {
		console.log("Bad data format in storage");
		initialCart = [];
	}
*/

export default function App() {
	/**
   * State management change from useState to useReducer -> cartReducer

    const [cart, setCart] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("cart")) ?? [];
      } catch {
        console.log("Bad data format in storage");
        return [];
      }
    });

    function addToCart(id, sku) {
      setCart((items) => {
        const itemInCart = items.find((i) => i.sku);

        if (!itemInCart) {
          return [...items, { id, sku, quantity: 1 }];
        }

        return items.map((i) =>
          i.sku === sku ? { ...i, quantity: i.quantity + 1 } : i
        );
      });
    }

    function updateQuantity(sku, quantity) {
      setCart((items) => {
        if (quantity === 0) {
          return items.filter((i) => i.sku !== sku);
        }

        return items.map((i) => (i.sku === sku ? { ...i, quantity } : i));
      });
    }

    function setEmptyCart() {
      setCart([]);
    }
   */

	/*
    --- With Context, state can be liftet/moved to the Provider:

    const [cart, dispatch] = useReducer(cartReducer, initialCart);
    useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  */

	// REACT FORM HOOK
	// <FormContext>
	const formContext = {
		storeFormOwner(owner) {
			localStorage.setItem("formOwner", owner);
			console.log("Hook Context. This is the Form Owner =>", owner);
		},

		setIsValidUser(isValidId) {
			localStorage.setItem("isValidUser", isValidId);
		},

		userId: 999666,
	};

	return (
		<>
			<div className="content">
				<Header />
				<main>
					<Routes>
						<Route
							path="/"
							element={<h1>Welcome to Carved Rock Fitness</h1>}
						/>
						<Route path="/:category" element={<Products />} />
						<Route
							path="/:category/:id"
							// Reducer
							// element={<Detail addToCart={addToCart} />}
							// element={<Detail dispatch={dispatch} />}
							element={<Detail />}
						/>
						<Route
							path="/cart"
							// Reducer
							// element={<Cart cart={cart} updateQuantity={updateQuantity} />}
							// element={<Cart cart={cart} dispatch={dispatch} />}
							element={<Cart />}
						/>

						<FormProvider {...formContext}>
							<Route
								path="/checkout"
								// Reducer
								// element={<Checkout cart={cart} setEmptyCart={setEmptyCart} />}
								// element={<Checkout cart={cart} dispatch={dispatch} />}
								element={<Checkout />}
							/>
						</FormProvider>
					</Routes>
				</main>
			</div>
			<Footer />
		</>
	);
}
