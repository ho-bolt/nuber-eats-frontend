import React from "react";
import { Button } from "../button";
import { render } from "@testing-library/react";

describe("<Button/>", () => {
  it("should render OK with props", () => {
    const { debug, getByText, rerender } = render(
      <Button canClick={true} loading={false} actionTest={"test"} />
    );
    getByText("test");
    rerender(<Button canClick={true} loading={true} actionTest={"test"} />);
    getByText("Loading...");
  });
  it("should display loading", () => {
    const { debug, getByText, container } = render(
      <Button canClick={false} loading={true} actionTest={"test"} />
    );
    getByText("Loading...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});

// it담에 나오는 should render Ok 이런 문구를 확인하고 싶다면
// verbose flag를 사용하면 된다.
//package.json test에 --verbose를 추가한다.
// container가 div를 가지고 온다.

// 중간에서 발생하는 implemention은 테스트코드에 작성하지 않고
// 유저가 보게되는 output만 테스트코드에 작성한다.
