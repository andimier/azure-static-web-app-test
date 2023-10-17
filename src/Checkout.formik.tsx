import React, { useState } from "react";
import { saveShippingAddress } from "./services/shippingService";
import { useCart } from "./cartContext";

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
    city: "",
    country: "",
    zip: "",
};

const STATUS = {
    IDLE: "IDLE",
    SUBMITTED: "SUBMITTED",
    SUBMITTING: "SUBMITTING",
    COMPLETED: "COMPLETED",
};

type FormValues = {
    city: string,
    country: string,
    zip: string,
};

interface FormContext {
    setIsValidUser: () => void;
    storeFormOwner: () => void;
    userId: number;
}

// export default function Checkout({ cart, setEmptyCart }) {
// export default function Checkout({ cart, dispatch }) {
export default function Checkout() {
    // Context
    const { dispatch } = useCart();

    const [address, setAddress] = useState(emptyAddress);
    const [status, setStatus] = useState(STATUS.IDLE);
    const [saveError, setSaveError] = useState(null);
    const [touched, setTouched] = useState({ city: '', country: ''});
    const [isValidId, setValidId] = useState(false);


    const errors = getErrors(address);

    function handleChange(e: any) {
        e.persist();

        setAddress((currentAddress) => {
            const el = e.target;

            return {
                ...currentAddress,
                [el.id]: el.value,
            };
        });
    }

    function handleBlur(event: any) {
        event.persist();

        setTouched((current) => {
            return {
                ...current,
                [event.target.id]: true,
            };
        });
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        setStatus(STATUS.SUBMITTING);

        if (!isValidId) {
            setStatus(STATUS.SUBMITTED);
            return;
        }

        try {
            saveShippingAddress(address)
            .then(() => {
                // setEmptyCart();
                dispatch({ type: "empty" });
                setStatus(STATUS.COMPLETED);
            });
        } catch (e) {
            setSaveError(e);
        }
    }

    interface ee {
        city: string,
        country: string
    };

    function getErrors(address: ee) {
        const errors = {
            city: '',
            country: '',
        };

        if (!address.city) {
            errors.city = "City is required";
        }

        if (!address.country) {
            errors.country = "Country is required";
        }

        return errors;
    }

    if (saveError) {
        throw saveError;
    }

    if (status === STATUS.COMPLETED) {
        return <h2>Thenks for shopping with us!</h2>;
    }


    return (
        <>
            <h1>Shipping Info</h1>
            {!isValid && status === STATUS.SUBMITTED && (
                <div role="alert">
                <p>Please fix the following errors</p>
                <ul>
                    {Object.keys(errors).map((key) => {
                    return <li>{errors[key]}</li>;
                    })}
                </ul>
                </div>
            )}

            {/*
                Este formato es apropiado para cuando se usa typescript
                <form onSubmit={hookHandleSubmit((data) => dataSubmit(data))}>
            */}

            {/*
                handleSubmit admit a seccond parameter for error handling,
                which is a function.
            */}

            <form>

                <div>
                    <h2>Please enter your ID</h2>
                    <input
                        type="number"
                        min="6"
                        style={{ width: "100px" }}

                    />
                </div>

                {/* {isValidId && */}
                    <div>
                        <div>
                            <label htmlFor="email">Please enter you email</label>
                            <br></br>
                            <input
                                id="email"
                                type="email"

                            />
                            <p role="alert"></p>
                        </div>

                        <div>
                            <label htmlFor="city">City</label>
                            <br />
                            <input
                                id="city"
                                type="text"

                                // value={address.city}
                                // onBlur={handleBlur}
                                // onChange={handleChange}
                            />

                            <p role="alert"></p>

                            {(touched.city || status === STATUS.SUBMITTED) && (
                                <p role="alert">errors.city</p>
                            )}

                        </div>

                        <div>
                            <label htmlFor="zip">Zip</label>
                            <br />

                            <input

                                id="zip"
                                type="text"
                                // value={address.zip}
                                // onBlur={handleBlur}
                                // onChange={handleChange}
                            />
                            <p role="alert"></p>


                        </div>

                        <div>
                            <label htmlFor="country">Country</label>
                            <br />
                            <select
                                id="country"

                                // value={address.country}
                                // onBlur={handleBlur}
                                // onChange={handleChange}
                            >
                                <option value="">Select Country</option>
                                <option value="China">China</option>
                                <option value="India">India</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="USA">USA</option>
                            </select>
                            {(touched.country || status === STATUS.SUBMITTED) && (
                                <p role="alert">errors.country</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => {

                            }}
                        >
                            Reset
                        </button>
                        <div>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Save Shipping Info"
                                disabled={status === STATUS.SUBMITTING}
                            />
                        </div>
                    </div>
                {/* } */}
            </form>
        </>
    );
}
