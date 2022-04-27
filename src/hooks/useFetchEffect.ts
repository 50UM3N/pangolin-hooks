import { useState, useEffect } from "react";

export interface IUseFetchEffect {
    (
        locator: string,
        options: {
            auth?: boolean;
            method?:
                | "GET"
                | "PUT"
                | "CONNECT"
                | "DELETE"
                | "POST"
                | "OPTIONS"
                | "TRACE"
                | "PATCH"
                | "HEAD";

            debug?: boolean;
        }
    ): [data: any, pending: boolean, error: null | string];
}

const useFetchEffect: IUseFetchEffect = (
    locator,
    { auth = true, method = "GET", debug = false }
) => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<null | string>(null);
    const [pending, setIsPending] = useState(true);
    useEffect(() => {
        setError(null);
        setIsPending(true);
        const token = window.localStorage.getItem("token");
        if (auth && !token) {
            setIsPending(false);
            setError("You are not authorize login again tok continue");
            return;
        }
        const abortCont = new AbortController();
        fetch(locator, {
            signal: abortCont.signal,
            method: method,
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
                "Content-type": "application/json",
            },
        })
            .then((res) => {
                setIsPending(false);
                if (debug)
                    return res.text().then((data) => {
                        throw Error(data);
                    });
                if (!res.ok)
                    return res.json().then((error) => {
                        throw Error(error.message);
                    });
                return res.text();
                // return res.json();
            })
            .then((data) => {
                setIsPending(false);
                try {
                    const parseData = JSON.parse(data);
                    setData(parseData);
                } catch (error) {
                    if (!data) data = "Operation successful";
                    setData(data);
                }
            })
            .catch((err) => {
                setIsPending(false);
                if (debug) {
                    console.log(err);
                    return;
                }
                if (err.name === "AbortError") return;
                setError(err.message);
            });
        return () => abortCont.abort();
    }, [locator, auth, method, debug]);

    return [data, pending, error];
};

export default useFetchEffect;
