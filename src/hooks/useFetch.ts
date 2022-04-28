import { useState, useCallback, useMemo } from "react";

type TUseFetch = (auth?: boolean) => [
    data: null | object,
    fetchData: TFetchData,
    functions: {
        pending: boolean;
        error: string | null;
        setPending: React.Dispatch<React.SetStateAction<boolean>>;
        setError: React.Dispatch<React.SetStateAction<string | null>>;
        abortCont: AbortController;
        setData: React.Dispatch<React.SetStateAction<null | object>>;
    }
];

type TFetchData = (
    locator: string,
    options?: {
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
) => void;

const useFetch: TUseFetch = (auth = true) => {
    const [data, setData] = useState<null | object>(null);
    const [error, setError] = useState<null | string>(null);
    const [pending, setPending] = useState(true);

    const abortCont = useMemo(() => new AbortController(), []);

    const fetchData: TFetchData = useCallback(
        (locator, { method= "GET", debug= false }={}) => {
            setPending(true);
            setData(null);
            setError(null);
            const token = window.localStorage.getItem("token");
            if (!token && auth) {
                setPending(false);
                setError("You are not authorize login again tok continue");
                return;
            }
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
                    setPending(false);
                    if (debug)
                        return res.text().then((data) => {
                            throw Error(data);
                        });
                    if (!res.ok)
                        return res.json().then((error) => {
                            throw Error(error.message);
                        });
                    return res.json();
                })
                .then((data) => {
                    setPending(false);
                    setData(data);
                })
                .catch((err) => {
                    setPending(false);
                    if (debug) {
                        console.log(err);
                        return;
                    }
                    if (err.name === "AbortError") return;
                    setError(err.message);
                });
        },
        [abortCont, auth]
    );
    return [
        data,
        fetchData,
        { pending, error, setPending, setError, abortCont, setData },
    ];
};

export default useFetch;
