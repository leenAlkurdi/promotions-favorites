import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PromotionsList from "../PromotionsList";

const t = (key: string, opts?: Record<string, any>) => {
  switch (key) {
    case "promotions.card.expiresIn":
      return `Expires in ${opts?.days} days`;
    case "promotions.card.expiresOn":
      return `Expires on ${opts?.date}`;
    case "empty.noResults":
      return "No results found";
    case "favorites.empty.body":
      return "Save promotions you like and find them here.";
    case "promotions.card.noImage":
      return "No image";
    case "promotions.card.expired":
      return "Expired";
    default:
      return key;
  }
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t }),
}));

const favoriteMutate = jest.fn();
const unfavoriteMutate = jest.fn();

jest.mock("@/features/promotions/hooks/useFavoritePromotion", () => ({
  useFavoritePromotion: () => ({ mutate: favoriteMutate, status: "idle" }),
}));

jest.mock("@/features/promotions/hooks/useUnfavoritePromotion", () => ({
  useUnfavoritePromotion: () => ({ mutate: unfavoriteMutate, status: "idle" }),
}));

jest.mock("../PromotionDetailModal", () => ({ promotion, onClose }: any) => (
  <div data-testid="promotion-modal">
    <span>{promotion.title}</span>
    <button onClick={onClose}>Close</button>
  </div>
));

jest.mock("next/image", () => (props: any) => {
  const { src, alt, priority: _priority, ...rest } = props;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...rest} />;
});

const promotions = [
  {
    id: "p1",
    title: "Promo One",
    merchant: "Shop A",
    rewardAmount: 10,
    rewardCurrency: "USD",
    description: "Desc",
    terms: "Terms",
    thumbnailUrl: "",
    expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    isFavorite: false,
    daysUntilExpiry: 5,
  },
  {
    id: "p2",
    title: "Promo Two",
    merchant: "Shop B",
    rewardAmount: 20,
    rewardCurrency: "USD",
    description: "Desc",
    terms: "Terms",
    thumbnailUrl: "",
    expiresAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    isFavorite: true,
    daysUntilExpiry: 2,
  },
];

describe("PromotionsList", () => {
  beforeEach(() => {
    favoriteMutate.mockClear();
    unfavoriteMutate.mockClear();
  });

  it("toggles favorite and unfavorite actions", async () => {
    render(<PromotionsList promotions={promotions} />);

    const addButtons = screen.getAllByRole("button", {
      name: "Add to favorites",
    });
    await userEvent.click(addButtons[0]);
    expect(favoriteMutate).toHaveBeenCalledWith("p1");

    const removeButtons = screen.getAllByRole("button", {
      name: "Remove from favorites",
    });
    await userEvent.click(removeButtons[0]);
    expect(unfavoriteMutate).toHaveBeenCalledWith("p2");
  });

  it("opens detail modal when a card is selected", async () => {
    render(<PromotionsList promotions={promotions} />);

    const cardButton = screen.getByRole("button", { name: /Promo One/i });
    await userEvent.click(cardButton);

    expect(screen.getByTestId("promotion-modal")).toHaveTextContent(
      "Promo One",
    );
  });

  it("shows empty state when no promotions", () => {
    render(<PromotionsList promotions={[]} isLoading={false} />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Save promotions you like and find them here."),
    ).toBeInTheDocument();
  });
});
