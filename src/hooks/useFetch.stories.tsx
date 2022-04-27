// https://pokeapi.co/api/v2/pokemon/ditto

import React, { useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import useFetch from "./useFetch";
const Example = () => {
    const [data, fetchData, pf] = useFetch(false);
    useEffect(() => {
        fetchData("https://pokeapi.co/api/v2/pokemon/ditto");

        return () => {
            pf.abortCont.abort();
        };
    }, [fetchData, pf.abortCont]);

    return (
        <>
            {pf.pending && <p>pending...</p>}
            {pf.error && <p>{pf.error}</p>}
            {data && <p>d{console.log(data)}</p>}
        </>
    );
};

export default {
    title: "ReactHookLibrary/useFetch",
    component: Example,
} as ComponentMeta<typeof Example>;

const Template: ComponentStory<typeof Example> = () => <Example />;

export const ReqresDeleteAPI = Template.bind({});
