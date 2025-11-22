import { Component, ComponentArgs } from "@streamlit/component-v2-lib";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { Client as Styletron } from 'styletron-engine-monolithic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, ThemeProvider, styled } from "baseui";
// Force load BaseUI Input styles by importing the Input component
// This ensures all Input-related styles are bundled and available
import DateInput from "./DateInput";
import type { DateInputDataShape, DateInputStateShape } from "./DateInput";

// Handle the possibility of multiple instances of the component to keep track
// of the React roots for each component instance.
const reactRoots: WeakMap<ComponentArgs["parentElement"], Root> = new WeakMap();

const engine = new Styletron();

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
});

const DateInputRoot: Component<DateInputStateShape, DateInputDataShape> = (args) => {
  const { parentElement, setStateValue, data } = args;  
  // Get the react-root div from the parentElement that we defined in our
  // `st.components.v2.component` call in Python.
  const rootElement = parentElement.querySelector(".react-root");

  if (!rootElement) {
    throw new Error("Unexpected: React root element not found");
  }

  // Check to see if we already have a React root for this component instance.
  let reactRoot = reactRoots.get(parentElement);
  if (!reactRoot) {
    // If we don't, create a new root for the React application using the React
    // DOM API.
    // @see https://react.dev/reference/react-dom/client/createRoot
    reactRoot = createRoot(rootElement);
    reactRoots.set(parentElement, reactRoot);
  }

  // Create onChange handler that updates the component state
  const onChange = (date: string | null) => {
    setStateValue("value", date);
  };

  // Extract date input data from args.data and provide defaults
  const dateInputData = {
    value: data.value ?? null,
    min: data.min ?? null,
    max: data.max ?? null,
    format: data.format ?? "YYYY/MM/DD",
    locale: data.locale ?? "en-US",
    disabled: data.disabled ?? false,
    width: data.width ?? "stretch",
    clearable: data.clearable ?? false,
    onChange: onChange,
  };

  reactRoot.render(
    <StrictMode>
      <StyletronProvider value={engine}>
        <ThemeProvider theme={LightTheme}>
          <Centered>
            <DateInput {...dateInputData} />
          </Centered>
        </ThemeProvider>
      </StyletronProvider>
    </StrictMode>,
  );

  // Return a function to cleanup the React application in the Streamlit
  // component lifecycle.
  return () => {
    const reactRoot = reactRoots.get(parentElement);

    if (reactRoot) {
      reactRoot.unmount();
      reactRoots.delete(parentElement);
    }
  };
};

export default DateInputRoot;
