import { useState, useCallback, useMemo } from "react";

type TUseFetch = (auth?: boolean) => [
    data: null | object,
    fetchData: TFetchData,
    functions: {
        isPending: boolean;
        error: string | null;
        setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
        setError: React.Dispatch<React.SetStateAction<string | null>>;
        abortCont: AbortController;
        setData: React.Dispatch<React.SetStateAction<null | object>>;
    }
];

type TFetchData = (locator: string) => void;

const useFetch: TUseFetch = (auth = true) => {
    const [data, setData] = useState<null | object>(null);
    const [error, setError] = useState<null | string>(null);
    const [isPending, setIsPending] = useState(true);

    const abortCont = useMemo(() => new AbortController(), []);

    const fetchData: TFetchData = useCallback(
        (locator) => {
            setIsPending(true);
            setData(null);
            setError(null);
            const token = window.localStorage.getItem("token");
            if (!token && auth) {
                setIsPending(false);
                setError("You are not authorize login again tok continue");
                return;
            }
            fetch(locator, {
                signal: abortCont.signal,
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                    "Content-type": "application/json",
                },
            })
                .then((res) => {
                    setIsPending(false);
                    if (!res.ok)
                        return res.json().then((error) => {
                            throw Error(error.message);
                        });
                    return res.json();
                })
                .then((data) => {
                    setData(data);
                })
                .catch((err) => {
                    if (err.name === "AbortError") return;
                    setError(err.message);
                });
        },
        [abortCont, auth]
    );
    return [
        data,
        fetchData,
        { isPending, error, setIsPending, setError, abortCont, setData },
    ];
};

export default useFetch;
