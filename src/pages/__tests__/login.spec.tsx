import { RenderResult, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { LOGIN_MUTATION, Login } from "../login";
import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;
  beforeEach(async () => {
    mockClient = createMockClient();
    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockClient}>
            <Login />
          </ApolloProvider>
        </Router>
      </HelmetProvider>
    );
  });

  it("should render Ok", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText("Email");
    userEvent.type(email, "this@wont");
    await waitFor(() => {
      expect(
        screen.queryByText("Please enter a vaild email")
      ).toBeInTheDocument();
    });

    userEvent.clear(email);
    await waitFor(() => {
      expect(screen.queryByText("Email is required")).toBeInTheDocument();
    });
  });
  it("displays password required errors", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const email = getByPlaceholderText("Email");

    const submitBtn = getByRole("button");
    userEvent.type(email, "1234@naver.com");
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.queryByText("Password is required")).toBeInTheDocument();
    });
  });

  it("submits form and calls mutations", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const email = getByPlaceholderText("Email");
    const password = getByPlaceholderText("Password");
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "1234",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: { ok: true, token: "xxx", error: "mutationError" },
      },
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    // localStorage를 훔쳐봄
    jest.spyOn(Storage.prototype, "setItem");
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        loginInput: {
          email: "real@test.com",
          password: "1234",
        },
      });
      // formData에서 가져온 data가 form에 입력되어 call됐는지 확인
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("mutationError");
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "xxx");
  });
});

// 지금은 client만 mocking하고 있다.
// state가 변하는 걸 자 반영해줘야 한다.
// i 는 대소문자 구분 안함

// onSubmit 처럼 function component안에 있는 function은 테스트할 수 없다.
// mutation을 확인하고자 할 때는 mock-apollo-client를 사용한다.
