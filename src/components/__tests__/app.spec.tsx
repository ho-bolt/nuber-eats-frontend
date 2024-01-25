import { render, waitFor } from "@testing-library/react";
import React from "react";
import { App } from "../app";
import { LoggedOutRouter } from "../../routers/logged-out-router";
import { isLoggedInVar } from "../../apollo";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>Logged-out</span>,
  };
});
jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>Logged-in</span>,
  };
});
describe("<App/>", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    getByText("Logged-out");
  });
  it("renders LoggedInRouter", async () => {
    const { getByText, debug } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("Logged-in");
    debug();
  });
});

// debug는 테스트를 하는 관점에서 app이 어떻게 생겼는지 보여준다.
//isLoggedInVar는 ReactiveVariable이다.
// waitFor에서 state가 refresh하고 사용할 수 있도록 기다려준다.
