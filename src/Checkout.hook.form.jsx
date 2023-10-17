import React, { useState, setState } from "react";
import { saveShippingAddress } from "./services/shippingService";
import { useCart } from "./cartContext";
import { useForm } from "react-hook-form";

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

// export default function Checkout({ cart, setEmptyCart }) {
// export default function Checkout({ cart, dispatch }) {
export default function Checkout() {
  // Context
  const { dispatch } = useCart();

  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});

  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  // REACT HOOK FORM
  const defaultValues = {
    city: "Bogotá",
    country: "Colombia",
    zip: "666",
  };

  const {
    register,
    handleSubmit: hookHandleSubmit,
    formState: { errors: hookErrors, isValid: hookIsValid },
    watch,
    reset,
  } = useForm({ defaultValues });

  console.log("is valid:", hookIsValid);
  // console.log("juckErrors", hookErrors);
  //
  /*
    console.log(watch());
    A specific element <input> can be passed as argument, to only evaluate this field:
    console.log(watch("city"));
  */

  const watchLog = watch(["city", "zip"]);

  function dataSubmit(data) {
    /**
     * This method can be asynchronous, for service fetching
     */
    console.log("data", data);
    setStatus(STATUS.SUBMITTING);

    // if (!isValid) {
    //   setStatus(STATUS.SUBMITTED);
    //   return;
    // }

    // try {
    //   saveShippingAddress(address).then(() => {
    //     // setEmptyCart();
    //     dispatch({ type: "empty" });
    //     setStatus(STATUS.COMPLETED);
    //   });
    // } catch (e) {
    //   setSaveError(e);
    // }
  }

  const onError = () => {
    console.log("Error manejado por el handleSubmit");
  };

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

      {/*
        Este formato es apropiado para cuando se usa typescript
        <form onSubmit={hookHandleSubmit((data) => dataSubmit(data))}>
      */}

      {/*
        handleSubmit admit a seccond parameter for error handling, which is a function
      */}
      <form onSubmit={hookHandleSubmit(dataSubmit, onError)}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            {...register("city", {
              minLength: {
                message: "Your city name must be at leat 10 characters long!",
                value: 10,
              },
              onBlur: () => {
                console.log("onblur");
              },
            })}
            id="city"
            type="text"
            // value={address.city}
            // onBlur={handleBlur}
            // onChange={handleChange}
          />
          <p role="alert">{hookErrors?.city?.message}</p>
          {(touched.city || status === STATUS.SUBMITTED) && (
            <p role="alert">errors.city</p>
          )}

          <h2>{watchLog.at(0)}</h2>
        </div>

        <div>
          <label htmlFor="zip">Zip</label>
          <br />
          <input
            {...register("zip", {
              maxLength: {
                value: 6,
                message: "Min length is 6 digits",
              },
            })}
            id="zip"
            type="text"
            // value={address.zip}
            // onBlur={handleBlur}
            // onChange={handleChange}
          />
          <p role="alert">{hookErrors?.zip?.message}</p>
          <h2>{watchLog[1]}</h2>
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            {...register("country", { required: true })}
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
            reset({
              city: "Milano",
              country: "Italy",
              zip: "234234",
            });
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
      </form>
    </>
  );
}
