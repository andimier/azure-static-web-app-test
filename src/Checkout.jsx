import React, { useState, setState } from "react";
import { saveShippingAddress } from "./services/shippingService";
import { useCart } from "./cartContext";
import { useForm } from "react-hook-form";

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: "",
  country: "",
};

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

// export default function Checkout({ cart, setEmptyCart }) {
// export default function Checkout({ cart, dispatch }) {
export default function Checkout() {
  const { register } = useForm();

  // Context
  const { dispatch } = useCart();

  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});

  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    e.persist();

    setAddress((currentAddress) => {
      const el = e.target;

      return {
        ...currentAddress,
        [el.id]: el.value,
      };
    });
  }

  function handleBlur(event) {
    event.persist();

    setTouched((current) => {
      return {
        ...current,
        [event.target.id]: true,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);

    if (!isValid) {
      setStatus(STATUS.SUBMITTED);
      return;
    }

    try {
      saveShippingAddress(address).then(() => {
        // setEmptyCart();
        dispatch({ type: "empty" });
        setStatus(STATUS.COMPLETED);
      });
    } catch (e) {
      setSaveError(e);
    }
  }

  function getErrors(address) {
    const errors = {};

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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={address.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {(touched.city || status === STATUS.SUBMITTED) && (
            <p role="alert">errors.city</p>
          )}
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}
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

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
