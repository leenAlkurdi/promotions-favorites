import { render, screen } from "@testing-library/react";
import EmptyState from "../EmptyState";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("EmptyState", () => {
  it("renders default copy and CTA", () => {
    render(<EmptyState />);

    expect(screen.getByText("No promotions")).toBeInTheDocument();
    expect(
      screen.getByText("There are no promotions to show right now."),
    ).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Browse promotions" });
    expect(cta).toHaveAttribute("href", "/promotions");
  });

  it("renders custom copy and CTA", () => {
    render(
      <EmptyState
        title="Empty favorites"
        body="You have not saved any promotions yet."
        cta="See all promotions"
      />,
    );

    expect(screen.getByText("Empty favorites")).toBeInTheDocument();
    expect(
      screen.getByText("You have not saved any promotions yet."),
    ).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "See all promotions" });
    expect(cta).toHaveAttribute("href", "/promotions");
  });
});
