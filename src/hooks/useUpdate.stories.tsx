import React, { useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import useUpdate from "./useUpdate";

const Form = () => {
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

export default {
    title: "ReactHookLibrary/useUpdate",
    component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = () => <Form />;

export const ReqresDeleteAPI = Template.bind({});
