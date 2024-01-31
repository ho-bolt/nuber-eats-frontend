import { render } from "@testing-library/react";
import React from "react";
import { NotFound } from "../404";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { FormTitle } from "../../components/form-title";

jest.mock("../../components/form-title", () => {
  return {
    FormTitle: () => <h4>Page Not Found</h4>,
  };
});

describe("<404/> Form Title  ", () => {
  const formTitleProp = {
    title: "Page Not Found",
  };

  it("renders 404 Form Title", () => {
    const { getByText } = render(
      <HelmetProvider>
        <FormTitle title={formTitleProp.title}></FormTitle>
      </HelmetProvider>
    );
    getByText("Page Not Found");
  });

  it("renders 404 Page", () => {
    <HelmetProvider>
      <Router>
        <NotFound />
      </Router>
    </HelmetProvider>;
  });
});
