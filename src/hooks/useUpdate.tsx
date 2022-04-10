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
        StatusComponent: React.FC,
        updateData: IUpdateData,
        abortCont: AbortController,
        status: {
            success: string | null;
            error: string | null;
            isPending: boolean;
        }
    ];
}

const useStyle = createUseStyles({
    toastWrapper: {
        position: "fixed",
        bottom: "0px",
        right: "0px",
        padding: "1rem",
        zIndex: 999,
        width: "100%",
        maxWidth: "400px",
    },
    toast: {
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        padding: "10px 5px 10px 22px",
        borderRadius: "4px",
        backgroundColor: "#fff",
        border: "1px solid rgb(233,236,239)",
        boxShadow:
            "rgb(0 0 0 / 5%) 0px 1px 3px, rgb(0 0 0 / 5%) 0px 28px 23px -7px, rgb(0 0 0 / 4%) 0px 12px 12px -7px",
        "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            width: "6px",
            top: "4px",
            bottom: "4px",
            left: "4px",
            borderRadius: "4px",
            backgroundColor: "rgb(28, 126, 214)",
        },
        "&.loading::before": {
            backgroundColor: "rgb(28, 126, 214)",
        },
        "&.success::before": {
            backgroundColor: "#0CA678",
        },
        "&.error::before": {
            backgroundColor: "#F03E3E",
        },
    },
    toastMessageWrapper: {
        color: "#000",
        fontFamily: "inherit",
        width: "calc(100% - 40px)",
        marginRight: "10px",
        display: "flex",
        alignItems: "center",
    },
    toastMessage: {
        fontSize: "14px",
        lineHeight: 1.4,
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    toastButton: {
        border: "1px solid transparent",
        color: "rgb(73 80 87)",
        backgroundColor: "transparent",
        position: "relative",
        appearance: "none",
        boxSizing: "border-box",
        height: "28px",
        minHeight: "28px",
        width: "28px",
        minWidth: "28px",
        borderRadius: "4px",
        padding: 0,
        lineHeight: 1,
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        alignItems: "center",
        "&:active": {
            transform: "translateY(1px)",
        },
        "&:hover": {
            backgroundColor: "rgb(248 249 250)",
        },
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
                    onSuccess(parseData);
                } catch (error) {
                    if (!data) data = "Operation successful";
                    setSuccess(data);
                    onSuccess(data);
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
    };

    // main status components that help to display status of our request
    const StatusComp: React.FC = () => {
        return (
            <>
                {isPending && (
                    <div className={classes.toastWrapper}>
                        <div
                            className={classes.toast}
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className={classes.toastMessageWrapper}>
                                <div className={classes.toastMessage}>
                                    Loading...
                                </div>
                            </div>
                            <button
                                type="button"
                                className={classes.toastButton}
                                data-bs-dismiss="toast"
                                aria-label="Close"
                                onClick={() => {
                                    setIsPending(false);
                                }}
                            >
                                <CrossIcon />
                            </button>
                        </div>
                    </div>
                )}
                {error && (
                    <div className={classes.toastWrapper}>
                        <div
                            className={classes.toast + " error"}
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className={classes.toastMessageWrapper}>
                                <div className={classes.toastMessage}>
                                    {error}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={classes.toastButton}
                                data-bs-dismiss="toast"
                                aria-label="Close"
                                onClick={() => {
                                    setError(null);
                                }}
                            >
                                <CrossIcon />
                            </button>
                        </div>
                    </div>
                )}
                {success && (
                    <div className={classes.toastWrapper}>
                        <div
                            className={classes.toast + " success"}
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className={classes.toastMessageWrapper}>
                                <div className={classes.toastMessage}>
                                    {success}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={classes.toastButton}
                                data-bs-dismiss="toast"
                                aria-label="Close"
                                onClick={() => {
                                    setSuccess(null);
                                }}
                            >
                                <CrossIcon />
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };
    return [StatusComp, updateData, abortCont, { success, error, isPending }];
};
export default useUpdate;

const CrossIcon = () => {
    return (
        <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
        >
            <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            ></path>
        </svg>
    );
};
