import React from "react";
import { FormError } from "../form-error";
import { render } from "@testing-library/react";

describe("<Form-error />", () => {
  it(" renders ok  with props ", () => {
    const { debug, getByText } = render(<FormError errorMessage="test" />);
    debug();
    getByText("test");
  });
});
