import React from "react";
import { useState } from "react";
import { createUseStyles } from "react-jss";
interface IUpdateData {
    (
        locator: string,
        options: {
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
            body?: object;
            onSuccess?: (data: any) => void;
            debug?: boolean;
        }
    ): void;
}

interface IUseUpdate {
    (baseURL: string, auth: boolean): [
        StatusComponent: IStatusComp,
        updateData: IUpdateData,
        abortCont: AbortController,
        status: {
            success: string | null;
            error: string | null;
            isPending: boolean;
        }
    ];
}
interface IStatusComp {
    (): JSX.Element;
    Button: React.FunctionComponent<
        React.DetailedHTMLProps<
            React.ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
        >
    >;
}

const useStyle = createUseStyles({
    label: {
        color: "red",
    },
});

const useUpdate: IUseUpdate = (baseURL, auth) => {
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const abortCont = new AbortController();
    const classes = useStyle();
    const updateData: IUpdateData = (
        locator,
        { method = "GET", body, onSuccess = () => {}, debug }
    ) => {
        setError(null);
        setIsPending(true);
        setSuccess(null);
        const token = window.localStorage.getItem("token");
        if (!token && auth) {
            setError("Unauthenticated.");
            setIsPending(false);
            return;
        }
        let options: any = {
            signal: abortCont.signal,
            method: method,
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
                "Content-type": "application/json",
            },
        };
        if (method !== "GET" && method !== "HEAD") options.body = body;

        fetch(baseURL + locator, options)
            .then((res) => {
                console.log(res);
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
            })
            .then((data) => {
                try {
                    let parseData = JSON.parse(data);
                    setSuccess(parseData.message);
                } catch (error) {
                    if (!data) data = "Operation successful";
                    setSuccess(data);
                }
                onSuccess(data);
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
    };

    // main status components that help to display status of our request
    const StatusComp: IStatusComp = () => {
        return (
            <>
                {isPending && (
                    <div className={classes.label} style={{ zIndex: 99999 }}>
                        <div
                            className="toast align-items-center text-white bg-secondary border-0 fade show"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="d-flex">
                                <div className="toast-body">Loading...</div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white me-2 m-auto"
                                    data-bs-dismiss="toast"
                                    aria-label="Close"
                                    onClick={() => {
                                        setIsPending(false);
                                    }}
                                ></button>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div
                        className="position-fixed bottom-0 end-0 p-3"
                        style={{ zIndex: 99999 }}
                    >
                        <div
                            className="toast align-items-center text-white bg-danger border-0 fade show"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="d-flex">
                                <div className="toast-body">{error}</div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white me-2 m-auto"
                                    data-bs-dismiss="toast"
                                    aria-label="Close"
                                    onClick={() => {
                                        setError(null);
                                    }}
                                ></button>
                            </div>
                        </div>
                    </div>
                )}
                {success && (
                    <div
                        className="position-fixed bottom-0 end-0 p-3"
                        style={{ zIndex: 99999 }}
                    >
                        <div
                            className="toast align-items-center text-white bg-success border-0 fade show"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="d-flex">
                                <div className="toast-body">{success}</div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white me-2 m-auto"
                                    data-bs-dismiss="toast"
                                    aria-label="Close"
                                    onClick={() => {
                                        setSuccess(null);
                                    }}
                                ></button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    // this is only for loading button or disable button
    StatusComp.Button = ({ children, ...rest }) => {
        return (
            <button disabled={isPending} {...rest}>
                {isPending && (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        ></span>
                        Loading...
                    </>
                )}
                {!isPending && children}
            </button>
        );
    };
    return [StatusComp, updateData, abortCont, { success, error, isPending }];
};
export default useUpdate;
