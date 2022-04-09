import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import useValidate from "./useValidate";
import {
    Checkbox,
    CheckboxGroup,
    Container,
    NumberInput,
    Radio,
    RadioGroup,
    RangeSlider,
    Select,
    Slider,
    Switch,
    Textarea,
    TextInput,
    Button,
} from "@mantine/core";

const Form = () => {
    const [form, validator] = useValidate(
        {
            name: { value: "", validate: "string|required", error: null },
            email: { value: "", validate: "string|required", error: null },
            age: { value: "", validate: "required", error: null },
            comment: { value: "", validate: "required", error: null },
            framework: { value: "", validate: "required", error: null },
            slider1: { value: 0, validate: "required", error: null },
            slider2: { value: [0, 100], validate: "required", error: null },
            privacy: { value: "", validate: "required", error: null },
            radio: { value: "", validate: "required", error: null },
            checkbox: { value: "", validate: "required", error: null },
        },
        {
            name: "Soumen Khara",
            email: "soumen@gmail.com",
            age: 10,
            comment: "okokok",
            framework: "svelte",
            slider1: 50,
            slider2: [10, 91],
            privacy: false,
            radio: "ng",
            checkbox: ["svelte", "vue"],
        }
    );

    const handelOnChange = (evt: { name: string; value: any }) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(validator.validate());
        console.table(form.slider2.value);
    };
    return (
        <Container size={"sm"}>
            <form onSubmit={handleSubmit}>
                <TextInput
                    my={"md"}
                    placeholder="Name"
                    label="Your name"
                    name="name"
                    required
                    onChange={(e) => handelOnChange(e.currentTarget)}
                    value={form.name.value}
                    error={form.name.error}
                />
                <TextInput
                    my={"md"}
                    placeholder="Email"
                    label="Your email"
                    name="email"
                    required
                    onChange={(e) => handelOnChange(e.currentTarget)}
                    value={form.email.value}
                    error={form.email.error}
                />
                <NumberInput
                    my={"md"}
                    placeholder="Your age"
                    label="Your age"
                    required
                    onChange={(e) => handelOnChange({ name: "age", value: e })}
                    value={form.age.value}
                    error={form.age.error}
                />
                <Textarea
                    my={"md"}
                    placeholder="Your comment"
                    label="Your comment"
                    required
                    name="comment"
                    onChange={(e) => handelOnChange(e.currentTarget)}
                    value={form.comment.value}
                    error={form.comment.error}
                />
                <Select
                    my={"md"}
                    label="Your favorite framework/library"
                    placeholder="Pick one"
                    data={[
                        { value: "react", label: "React" },
                        { value: "ng", label: "Angular" },
                        { value: "svelte", label: "Svelte" },
                        { value: "vue", label: "Vue" },
                    ]}
                    onChange={(e) =>
                        handelOnChange({ name: "framework", value: e })
                    }
                    value={form.framework.value}
                    error={form.framework.error}
                />
                <Slider
                    my={"md"}
                    marks={[
                        { value: 20, label: "20%" },
                        { value: 50, label: "50%" },
                        { value: 80, label: "80%" },
                    ]}
                    onChange={(e) =>
                        handelOnChange({ name: "slider1", value: e })
                    }
                    value={form.slider1.value}
                />
                <RangeSlider
                    my={"md"}
                    marks={[
                        { value: 20, label: "20%" },
                        { value: 50, label: "50%" },
                        { value: 80, label: "80%" },
                    ]}
                    onChange={(e) => {
                        handelOnChange({ name: "slider2", value: e });
                    }}
                    value={form.slider2.value}
                />
                <Switch
                    my={"md"}
                    label="I agree to sell my privacy"
                    onChange={(e) =>
                        handelOnChange({
                            name: "privacy",
                            value: e.currentTarget.checked,
                        })
                    }
                    value={form.privacy.value}
                />
                <RadioGroup
                    my={"md"}
                    label="Select your favorite framework/library"
                    description="This is anonymous"
                    required
                    onChange={(e) =>
                        handelOnChange({ name: "radio", value: e })
                    }
                    value={form.radio.value}
                    error={form.radio.error}
                >
                    <Radio value="react" label="React" />
                    <Radio value="svelte" label="Svelte" />
                    <Radio value="ng" label="Angular" />
                    <Radio value="vue" label="Vue" />
                </RadioGroup>
                <CheckboxGroup
                    my={"md"}
                    defaultValue={["react"]}
                    label="Select your favorite framework/library"
                    description="This is anonymous"
                    required
                    onChange={(e) =>
                        handelOnChange({ name: "checkbox", value: e })
                    }
                    value={form.checkbox.value}
                    error={form.checkbox.error}
                >
                    <Checkbox value="react" label="React" />
                    <Checkbox value="svelte" label="Svelte" />
                    <Checkbox value="ng" label="Angular" />
                    <Checkbox value="vue" label="Vue" />
                </CheckboxGroup>
                <Button type="submit">Submit</Button>
            </form>
        </Container>
    );
};

export default {
    title: "ReactHookLibrary/useValidate",
    component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = () => <Form />;

export const ReqresDeleteAPI = Template.bind({});
