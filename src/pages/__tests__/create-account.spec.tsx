import { MockApolloClient, createMockClient } from "mock-apollo-client";

import { ApolloProvider } from "@apollo/client";
import { render, waitFor, RenderResult, screen } from "@testing-library/react";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/graphql";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

describe("<Create-Account/>", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    mockedClient = createMockClient();
    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockedClient}>
            <CreateAccount />
          </ApolloProvider>
        </Router>
      </HelmetProvider>
    );
  });

  it("should renders create-account ", async () => {
    await waitFor(() => expect(document.title).toBe("Create Account | Nuber"));
  });

  it("renders Email validation", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;

    const email = getByPlaceholderText(/email/i);
    userEvent.type(email, "test@naver");
    await waitFor(() => {
      expect(
        screen.queryByText("Please enter a valid email")
      ).toBeInTheDocument();
    });
  });

  it("renders Password validation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText("Password is required")).toBeInTheDocument();
    });
  });

  it("submits mutation with form values ", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    const formData = {
      email: "test@aver.com",
      password: "1234",
      role: UserRole.Client,
    };
    const mockLoginMutation = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutationError",
        },
      },
    });
    mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockLoginMutation);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });

    expect(mockLoginMutation).toHaveBeenCalledTimes(1);
    expect(mockLoginMutation).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
  });
});
