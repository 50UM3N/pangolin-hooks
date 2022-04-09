import React, { useState } from "react";
// required|number|string|email|confirm_password

const prevStateConverter = (data: ValidatorState, old: object | null | any) => {
    for (let [key] of Object.entries(data)) {
        if (data[key].validate.includes("required")) data[key].required = true;
        else data[key].required = false;
    }

    if (old !== null) {
        for (let [key] of Object.entries(data)) {
            if (old[key] !== undefined && old[key] !== null)
                data[key].value = old[key];
        }
    }
    return data;
};

interface IUseValidate {
    (value: ValidatorState, old?: object | null): [
        state: ValidatorState,
        functions: {
            validate: () => boolean;
            validOnChange: TValidOnChange;
            generalize: (newState?: object | undefined) => object;
            reset: () => void;
            setState: React.Dispatch<React.SetStateAction<ValidatorState>>;
        }
    ];
}
type TValidOnChange = (
    element: { value: any; name: string },
    callback?: (
        value: any,
        name: string,
        setState: React.Dispatch<React.SetStateAction<ValidatorState>>
    ) => void
) => void;

type TValidationTypes =
    | string
    | ""
    | "required"
    | "number"
    | "string"
    | "email"
    | "confirm_password";

type ValidatorState = {
    [key: string]: {
        value: any;
        validate: TValidationTypes;
        error: null | string;
        required?: boolean;
    };
};
const useValidate: IUseValidate = (value, old = null) => {
    const [state, setState] = useState<ValidatorState>(
        prevStateConverter(value, old)
    );

    const checkRequired = (value: string) => {
        if (
            value === undefined ||
            value === null ||
            value.length === 0 ||
            value === "null"
        )
            return { valid: false, message: "This field can not be empty" };
        else return { valid: true, message: null };
    };
    const checkNumber = (value: string) => {
        if (!isNaN(+value)) return { valid: true, message: null };
        else return { valid: false, message: "This field must be a number" };
    };
    const checkString = (value: string) => {
        if (typeof value === "string") return { valid: true, message: null };
        else return { valid: false, message: "This field must be a string" };
    };
    const checkEmail = (value: string) => {
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
            return { valid: true, message: null };
        else
            return {
                valid: false,
                message: "Please enter a valid email address",
            };
    };
    const checkConfirmPassword = (
        password: string,
        confirmPassword: string
    ) => {
        if (password === confirmPassword) return { valid: true, message: null };
        return { valid: false, message: "Password does not match" };
    };

    const validOnChange: TValidOnChange = (
        { value, name },
        callback = () => {}
    ) => {
        let oldState: any = { value: value };
        let validation = state[name].validate;
        if (validation) {
            let validate = validateField(validation.split("|"), value);
            oldState.error = validate.message;
        }
        // change state accordingly
        setState((prev) => {
            prev[name] = { ...prev[name], ...oldState };
            return { ...prev };
        });

        callback(value, name, setState);
    };

    const validateField = (
        validation: Array<TValidationTypes>,
        value: any
    ): { valid: boolean; message: string | null } => {
        let validMsg: { valid: boolean; message: string | null } = {
            valid: true,
            message: null,
        };
        for (let i = 0; i < validation.length; i++) {
            let type = validation[i];
            switch (type) {
                case "required":
                    validMsg = checkRequired(value);
                    break;
                case "number":
                    validMsg = checkNumber(value);
                    break;
                case "string":
                    validMsg = checkString(value);
                    break;
                case "email":
                    validMsg = checkEmail(value);
                    break;
                case "confirm_password":
                    validMsg = checkConfirmPassword(
                        value,
                        state["password"].value
                    );
                    break;
                default:
                    validMsg = { valid: true, message: null };
            }
            if (!validMsg.valid) break;
        }
        return validMsg;
    };
    const validate = () => {
        let flag = true;
        let oldState = { ...state };
        for (let [key] of Object.entries(oldState)) {
            let data = oldState[key];
            let validate = validateField(data.validate.split("|"), data.value);
            if (!validate.valid) flag = false;
            data.error = validate.message;
        }
        if (!flag) setState({ ...oldState });
        return flag;
    };

    const generalize = (newState?: object): object => {
        let response: any = {};
        for (let [key, data] of Object.entries(
            newState ? { ...newState } : { ...state }
        )) {
            response[key] = data.value;
        }
        return response;
    };
    const reset = () => {
        setState(value);
    };
    return [state, { validate, validOnChange, generalize, reset, setState }];
};

export default useValidate;
