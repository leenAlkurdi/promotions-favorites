import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoritesList from "../FavoritesList";

const t = (key: string, opts?: Record<string, any>) => {
  switch (key) {
    case "promotions.card.expiresIn":
      return `Expires in ${opts?.days} days`;
    case "promotions.card.expiresOn":
      return `Expires on ${opts?.date}`;
    case "favorites.empty.title":
      return "No favorites yet";
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

jest.mock(
  "@/features/promotions/components/PromotionDetailModal",
  () =>
    ({ promotion, onClose }: any) => (
      <div data-testid="favorite-modal">
        <span>{promotion.title}</span>
        <button onClick={onClose}>Close</button>
      </div>
    ),
);

jest.mock("next/image", () => (props: any) => {
  const { src, alt, priority: _priority, ...rest } = props;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...rest} />;
});

const favorites = [
  {
    id: "f1",
    title: "Fav One",
    merchant: "Store A",
    rewardAmount: 5,
    rewardCurrency: "USD",
    description: "Desc",
    terms: "Terms",
    thumbnailUrl: "",
    expiresAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    isFavorite: true,
    daysUntilExpiry: 3,
  },
];

describe("FavoritesList", () => {
  beforeEach(() => {
    favoriteMutate.mockClear();
    unfavoriteMutate.mockClear();
  });

  it("unfavorites an item when toggled", async () => {
    render(<FavoritesList favorites={favorites} />);

    const removeButton = screen.getByRole("button", {
      name: "Remove from favorites",
    });
    await userEvent.click(removeButton);

    expect(unfavoriteMutate).toHaveBeenCalledWith("f1");
  });

  it("opens modal when selecting a card", async () => {
    render(<FavoritesList favorites={favorites} />);

    const cardButton = screen.getByRole("button", { name: /Fav One/i });
    await userEvent.click(cardButton);

    expect(screen.getByTestId("favorite-modal")).toHaveTextContent("Fav One");
  });

  it("shows empty state when list is empty", () => {
    render(<FavoritesList favorites={[]} isLoading={false} />);

    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    expect(
      screen.getByText("Save promotions you like and find them here."),
    ).toBeInTheDocument();
  });
});
