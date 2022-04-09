import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import useUpdate from "./useUpdate";

const Form = () => {
    const [StatusComp, updateData, abortCont, { isPending }] = useUpdate(
        "https://reqres.in/api",
        false
    );
    const handleClick = () => {
        updateData("/users/2", { method: "DELETE" });
    };
    return (
        <>
            <StatusComp />
            <button disabled={isPending} onClick={handleClick}>
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
