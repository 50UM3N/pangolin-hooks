# Pangolin Hooks

Pangolin Hooks a react Hook library containing multiple hook to handle certain type of task.

-   useValidate
-   useUpdate
-   useFetch
-   useFetchEffect
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
import {useValidate} from "pangolin-hook";

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
import {useValidate} from "pangolin-hook";

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

## useFetch

This hook help to fetch data from any api location and gives the parsed json form of data.

`useFetch` hook accepts only one argument `auth:boolean` that helps to do a api authentication. The api authentication works in the header property the authentication set like that `Authorization: "Bearer " + token` the token is get from local storage with the default key name `token`. If the token is not present in the local storage then it will give error as `unauthenticated`.

`useFetch` returns an array of three return value.

-   `data` - The data fetch from the server of any api.
-   `fetchData` - This is a function help to fetch the data from the server or any location having two arguments `location` and `options`

    -   `locator` - The api location eg - `https://pokeapi.co/api/v2/pokemon/ditto`.
    -   `options` - This is an object and optional and the default value is `{method: "GET", debug: false}`. If the debug is true it will throw an error in the browser console.

-   `pending` - `boolean` This is an state the represent that the data is fetching like loading
-   `error` - `boolean|string` This is an state show that there is an error or not.
-   `setPending` - This will set the state of the pending.
-   `setError` - This will set the state of the error.
-   `setData` - This will set the state of the data.
-   `abortCont` - This will help to abort the ongoing request if the component is unmount. Use this in the cleanup function.

### Usage

This is an simple example with cleanup function

```tsx
import React, { useEffect } from "react";
import { useFetch } from "pangolin-hook";
const Example = () => {
    const [data, fetchData, pf] = useFetch(false);
    useEffect(() => {
        fetchData("https://jsonplaceholder.typicode.com/todos/1");
        return () => {
            pf.abortCont.abort();
        };
    }, [fetchData, pf.abortCont]);

    return (
        <>
            {pf.pending && <p>Pending...</p>}
            {pf.error && <p>{pf.error}</p>}
            {data && <p>{JSON.stringify(data)}</p>}
        </>
    );
};
```

The p tag with data shows `{"userId":1,"id":1,"title":"delectus aut autem","completed":false}` after getting the response.

## useFetchEffect

This similar type of hook like `useFetch` but less options to set and already having the abort controller in useEffect cleanup function.

`useFetchEffect` hook accepts only two arguments `locator` and the `options`.

-   `locator` - The api location eg - `https://pokeapi.co/api/v2/pokemon/ditto`.
-   `options` - This is an object and optional and the default value is `{auth:true, method: "GET", debug: false}`. If the debug is true it will throw an error in the browser console. The auth options help to authenticate the api like useFetch.

`useFetchEffect` returns an array of three return value.

-   `data` - The data fetch from the server of any api.
-   `pending` - `boolean` This is an state the represent that the data is fetching like loading
-   `error` - `boolean|string` This is an state show that there is an error or not.

### Usage

This is an simple example with cleanup function

```tsx
import React, { useEffect } from "react";
import { useFetchEffect } from "pangolin-hook";
const Example = () => {
    const [data, pending, error] = useFetchEffect(
        "https://jsonplaceholder.typicode.com/todos/1",
        { auth: false }
    );

    return (
        <>
            {pending && <p>pending...</p>}
            {error && <p>{error}</p>}
            {data && <p>{JSON.stringify(data)}</p>}
        </>
    );
};
```

The p tag with data shows `{"userId":1,"id":1,"title":"delectus aut autem","completed":false}` after getting the response.

## useUpdate

This similar type of hook like `useFetch` and `useFetchEffect` but use for only sending data to the server by various http methods. Having all others features like other two hooks.

`useFetchEffect` hook accepts only two arguments `baseURL` and the `auth`.

-   `baseURL` - The api base eg - `https://pokeapi.co/api/v2`.
-   `auth` - The auth options help to authenticate the api like useFetch.

`useFetchEffect` returns an array of two return value.
If the server send an json then it must contain a key name `message` where contain the message otherwise the text message shown in the status `success`

-   `updateData` - This function helps to pass send the request to the server. This function takes two arguments `locator` and `options`
    -   `locator` - The path you want to send request eg - `/some-location`
    -   `options` - The options is an object with default value `{ method = "GET", body, onSuccess = (data) => void 0, debug = false }`
        -   `method` - HTTP methods `"GET" | "PUT" | "CONNECT" | "DELETE" | "POST" | "OPTIONS" | "TRACE" | "PATCH" | "HEAD"`
        -   `body` - This the body of fetch request must be convert into string before sending.
        -   `onSuccess` - this callback function call when the request is successfully and `data` is the return value from the server.
        -   `debug` - If the debug is true it will throw an error in the browser console.
-   `status` - This is an object having multiple status and options.
    -   `success` - Show success message that comes from the server. If the server send status code `ok` then it will display default `Operation successful` message. If the server send an text message the the message is set to the success. If the server send an object then the object must contains an key `message` which one is set to the this.
    -   `error` - Error message if any case
    -   `pending` - `boolean` This is an state the represent that the data is fetching like loading. You can use this in the combination of button disabled property.
    -   `abortCont` - This will help to abort the ongoing request if the component is unmount. Use this in the cleanup function.
    -   `StatusComp` - This is an jsx Element that show a toast message according to `success , error, pending` status.

### Usage

This is an simple example with cleanup function

```tsx
import React, { useUpdate } from "react";
import { useFetchEffect } from "pangolin-hook";
const Example = () => {
    const [updateData, { pending, abortCont, StatusComp }] = useUpdate(
        "https://reqres.in/api",
        false
    );

    useEffect(() => {
        return () => {
            abortCont.abort();
        };
    }, [abortCont]);

    const handleClick = () => {
        updateData("/users/2", { method: "DELETE" });
    };
    return (
        <>
            <StatusComp />
            <button disabled={pending} onClick={handleClick}>
                Click Me
            </button>
        </>
    );
};
```
