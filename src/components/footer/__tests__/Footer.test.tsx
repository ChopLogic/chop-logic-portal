import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("should render the footer", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeDefined();
  });

  it("should match snapshot", () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
