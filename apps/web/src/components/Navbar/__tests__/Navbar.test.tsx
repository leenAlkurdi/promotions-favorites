import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../Navbar";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: jest.fn(), dir: () => "ltr" },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  useSearchParams: () => ({ get: () => "" }),
}));

jest.mock("../LanguageToggle", () => ({
  LanguageToggle: () => <button aria-label="language-toggle" />,
}));

jest.mock("../NavbarTabs", () => () => <div role="tablist">Tabs</div>);

jest.mock("next/image", () => (props: any) => {
  const { src, alt, priority: _priority, ...rest } = props;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...rest} />;
});

describe("Navbar", () => {
  test("mobile menu opens and closes with Escape", async () => {
    render(<Navbar />);

    const buttons = screen.getAllByRole("button");
    const menuToggle = buttons[1]; // second button is the burger toggle

    await userEvent.click(menuToggle);

    const tablistsOpen = screen.getAllByRole("tablist");
    expect(tablistsOpen).toHaveLength(2); // desktop + mobile

    await userEvent.keyboard("{Escape}");

    const tablistsClosed = screen.getAllByRole("tablist");
    expect(tablistsClosed).toHaveLength(1); // desktop only
  });
});
