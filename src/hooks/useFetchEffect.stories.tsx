// https://pokeapi.co/api/v2/pokemon/ditto

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import useFetchEffect from "./useFetchEffect";
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

export default {
    title: "ReactHookLibrary/useFetchEffect",
    component: Example,
} as ComponentMeta<typeof Example>;

const Template: ComponentStory<typeof Example> = () => <Example />;

export const RequestTODOAPI = Template.bind({});
