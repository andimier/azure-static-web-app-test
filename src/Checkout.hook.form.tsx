import React, { useState } from "react";
import { saveShippingAddress } from "./services/shippingService";
import { useCart } from "./cartContext";
import { useForm, useFormContext } from "react-hook-form";

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

const defaultValues = {
    city: "Bogotá",
    country: "Colombia",
    email: "email",
    isValidUser: false,
    zip: "3487",
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

    // FORM CONTEXT HOOK
    // Props passed by the parent via <FormProvider>
    const { setIsValidUser, storeFormOwner, userId }: FormContext = useFormContext();

    const errors = getErrors(address);
    const isValid = Object.keys(errors).length === 0;

    // REACT HOOK FORM
    const {
        register,
        handleSubmit: hookHandleSubmit,
        formState: {
            errors: hookErrors,
            isValid: hookIsValid,
            dirtyFields
        },
        watch,
        reset,
    } = useForm({ defaultValues });

    // console.log('is dirty', isDirty);
    console.log("is valid:", hookIsValid);
    // console.log("Hook Errors", hookErrors);

    /*
        console.log(watch());
        A specific element <input> can be passed as argument, to only evaluate this field:
        console.log(watch("city"));
    */

    // Register inputs to watch on change
    // const watchLog = watch(["city", "zip"]);
    const [cityWatch, zipWatch] = watch(["city", "zip"]);

    console.log('dirty fields', dirtyFields);

    // Direct call of a <FormContext> function hook
    storeFormOwner('Andrés');

    // Alternative use case for the watch API
    function validateIsValidUser(event: any) {
        const id = event.target.value;

        if (!isValid && Number(id) === userId) {
            // Display the form
            setValidId(true);
            setIsValidUser(true);
        }
    }

    async function dataSubmit(data: FormValues) {
        /**
         * This method can be asynchronous, for service fetching
         */

        console.log("data", data);
        setStatus(STATUS.SUBMITTING);

        try {
            await saveShippingAddress(address);
            dispatch({ type: "empty" });
            setStatus(STATUS.COMPLETED);
        } catch (e) {
            setSaveError(e);
        }
    }

    // HandleSubmit second argument. If there are errors, on submit, this function will be
    // triggered instead of the submit

    const onError = (error: any) => {
        console.log("Error on handleSubmit", error);
    };

    function handleHookOnChange(e: any) {
        const el = e.target;

        setAddress((currentAddress) => {
            return {
                ...currentAddress,
                [el.id]: el.value,
            };
        });
    }

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

        if (!isValid) {
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

    function enableTwoWayBiding() {
        const dirtyFieldsLength = Object.keys(dirtyFields).length;

        return dirtyFieldsLength > 1 && dirtyFields.isValidUser === true;
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

            <form onSubmit={hookHandleSubmit(dataSubmit, onError)}>

                <div>
                    <h2>Please enter your ID</h2>
                    <input
                        type="number"
                        min="6"
                        style={{ width: "100px" }}
                        {...register("isValidUser", {
                                minLength: 6,
                                required: true,
                                onChange: validateIsValidUser,
                                valueAsNumber: true
                            })
                        }
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
                                {...register("email", {
                                        required: "required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Entered value does not match email format"
                                        }
                                    }
                                )}
                            />
                            <p role="alert">{hookErrors?.email?.message}</p>
                        </div>

                        <div>
                            <label htmlFor="city">City</label>
                            <br />
                            <input
                                id="city"
                                type="text"
                                {...register("city", {
                                        minLength: {
                                            message: "Your city name must be at leat 10 characters long!",
                                            value: 10,
                                        },
                                        onBlur: () => {
                                            console.log("onblur");
                                        },
                                        onChange: handleHookOnChange,
                                        pattern: /[A-Za-z]{3}/
                                })}
                                // value={address.city}
                                // onBlur={handleBlur}
                                // onChange={handleChange}
                            />

                            <p role="alert">{hookErrors?.city?.message}</p>

                            {(touched.city || status === STATUS.SUBMITTED) && (
                                <p role="alert">errors.city</p>
                            )}
                            {enableTwoWayBiding() &&
                                // <p>{watchLog.at(0)}</p>
                                <p>{cityWatch}</p>
                            }
                        </div>

                        <div>
                            <label htmlFor="zip">Zip</label>
                            <br />

                            <input
                                {...register("zip", {
                                maxLength: {
                                    value: 6,
                                    message: "Max length is 6 digits",
                                },
                                })}
                                id="zip"
                                type="text"
                                // value={address.zip}
                                // onBlur={handleBlur}
                                // onChange={handleChange}
                            />
                            <p role="alert">{hookErrors?.zip?.message}</p>

                            {enableTwoWayBiding() &&
                                <p>{zipWatch}</p>
                            }
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
                    </div>
                {/* } */}
            </form>
        </>
    );
}
