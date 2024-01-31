import { queryByText, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Header } from "../header";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header/>", () => {
  // query를 request하고 result에 결과를 mock하고 있다.
  it("renders verify banner", async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: "",
                    email: "",
                    role: "",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText("Please verify Your Email");
    });
  });
  it("renders without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: "",
                    email: "",
                    role: "",
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(queryByText("Please verify your email.")).toBeNull();
    });
  });
});

// condition이 있으면 mock을 해야함
// hook자체를 mock 하면 안되고 hook에 결과를 주는 걸 mock해야한다.
// 즉 서버에 보내는 graphql request를 mock한다. (ME_QUERY)
// 이걸 MockedProvider의 mocks로 prop을 받는다
// mocks는 query, mutation, result를 mock할 수 있게 해준다.

// query를 때려서 결과가 바로 나오는 게 아니라 나오기까지 시간이 걸린다.
// 따라서 response를 기다려야한다.

// 컴포넌트에 특정 text가 없다는 걸 확인하고 싶다면?
// queryByText 메소드
