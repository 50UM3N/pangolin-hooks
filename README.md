# Pangolin Hooks

Pangolin Hooks a react Hook library containing multiple hook to handle certain type of task.

Currently there are two hooks.

-   useValidate
-   useUpdate

## Installation

This hook library does not depend on other library so you can use this with any other library.

Install with npm:

    npm install pangolin-hooks

Install with yarn:

    yarn add pangolin-hooks

## useValidate

This hooks help to handle form input with certain type of validation.

`useValidate` hook accepts two arguments with a configuration object that includes the following properties:

-   `formSchema` - this is an object of key and option field `{[key]:option}`, the option object having four key pair
    `{ value: any; validate: string; error: null | string; required?: boolean; }`. The validate property must be empty string or combination of `"required" | "number" | "string" | "email" | "confirm_password"` separated with `|`. The `required` field is optional it will set true or false if the validate field contain `required`.
-   `oldValue` - the is the old value of the form get from server the format will be `{[key]:value}`. `useValidate` will map each of value of the key with the form schema key's value

Hook returns an array of form schema and the functions object:

-   `form` - contain the same form schema that pass in the `useValidate` hook.
-   `functions` - object contains multiple functions
    -   `validate` - this function return true or false according to the formSchema validation for all keys.
    -   `validOnChange` - on change function takes `{value:any, name:string}` object and validate the change field.
    -   `generalize` - this function return object of the formSchema with generalize form that help to pass in server.
    -   `reset` - reset the form.
    -   `setState` - react setState directly connected with formSchema.

### Usage

This is the simple form with submit and on change event

```tsx
import {useValidate} from "pangolin-hooke";

function Demo(){
    const [form, validator] = useValidate({
        name: { value: "", validate: "required|string", error: null },
        email: { value: "", validate: "required|email", error: null },
    });

    const handleSubmit = (e)=>{
        e.preventDefault();
        // check that all the field are valid
        if(!validator.validate()) return;

        // get the key value pair of the formSchema
        const data = validator.generalize();

        // send it to the server
        ....
    }

    return (
        <form onSubmit={handleSubmit} >
            <input
                type="text"
                name="name"
                placeHolder="Enter your name"
                onChange=(e=>handleOnChange(e.currentTarget))
                value={form.name.value}
            />

            <input
                type="email"
                name="email"
                placeHolder="Enter your email"
                onChange=(e=>handleOnChange(e.currentTarget))
                value={form.email.value}
            />

            <button type="submit"> submit </button>
        </form>
    )
}
```

Display error in the form for each field

```tsx
...
return (
    <form onSubmit={handleSubmit} >
        ...
        <input
            type="text"
            name="name"
            placeHolder="Enter your name"
            onChange=(e=>handleOnChange(e.currentTarget))
            value={form.name.value}
        />
        {form.name.error && <span>{form.name.error}</span>}

        <input
            type="email"
            name="email"
            placeHolder="Enter your email"
            onChange=(e=>handleOnChange(e.currentTarget))
            value={form.email.value}
        />
        {form.email.error && <span>{form.email.error}</span>}

        ...
    </form>
)

```

Set the previous data i.e the data that get from server

```tsx
import {useValidate} from "pangolin-hooke";

function Demo(){
    const [form, validator] = useValidate(
        {
        name: { value: "", validate: "required|string", error: null },
        email: { value: "", validate: "required|email", error: null },
        },
        {
            name:"something name",
            email:"something@dev.com"
        }
    );

    ...

}

```

Clear the form field after submitting the form

```tsx
function Demo(){
    ...
    const handleSubmit = (e)=>{
        ...
            validator.reset();
        ...
    }
    ...
}

```
