import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import useUpdate from "./useUpdate";

const Form = () => {
    const [StatusComp, updateData] = useUpdate("https://reqres.in/api", false);
    const handleClick = () => {
        updateData("/users/2", { method: "DELETE" });
    };
    return (
        <>
            <StatusComp />
            <StatusComp.Button onClick={handleClick}>
                Click Me
            </StatusComp.Button>
        </>
    );
};

export default {
    title: "ReactComponentLibrary/useUpdate",
    component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = () => <Form />;

export const ReqresDeleteAPI = Template.bind({});
