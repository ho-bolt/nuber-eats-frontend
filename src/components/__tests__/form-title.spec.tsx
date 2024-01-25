import { render } from "@testing-library/react";
import React from "react";
import { FormTitle } from "../form-title";

describe("<FormTitle/ >", () => {
  it("renders Ok with props ", () => {
    const { getByText } = render(<FormTitle title="test" />);
    getByText("test");
  });
});
