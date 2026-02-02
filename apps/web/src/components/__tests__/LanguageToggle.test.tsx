import { render, screen, fireEvent } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../Navbar/LanguageToggle";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

type MockTranslationParams = { language?: "en" | "ar" };

const makeUseTranslationMock = ({
  language = "en",
}: MockTranslationParams = {}) => {
  const changeLanguage = jest.fn();
  return {
    t: (key: string) => key,
    i18n: {
      language,
      changeLanguage,
      dir: jest.fn(() => (language === "ar" ? "rtl" : "ltr")),
    },
    changeLanguage,
  };
};

const mockedUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;

describe("LanguageToggle", () => {
  beforeEach(() => {
    document.documentElement.dir = "";
    jest.clearAllMocks();
  });

  it("sets document direction on mount and renders translated label", () => {
    const mock = makeUseTranslationMock({ language: "en" });
    mockedUseTranslation.mockReturnValue(mock as never);

    render(<LanguageToggle />);

    const button = screen.getByRole("button", { name: "navbar.language" });
    expect(button).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("switches language and updates dir when clicked", () => {
    const mock = makeUseTranslationMock({ language: "en" });
    mockedUseTranslation.mockReturnValue(mock as never);

    render(<LanguageToggle />);

    fireEvent.click(screen.getByRole("button"));

    expect(mock.i18n.changeLanguage).toHaveBeenCalledWith("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
