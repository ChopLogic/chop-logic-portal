import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header", () => {
  it("should render the header banner", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeDefined();
  });

  it("should match snapshot", () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
