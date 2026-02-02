import type { ReactNode } from "react";
import { CardActionHandlers, CardItem } from "../Card/Card.types";

export type ListView = "grid" | "list";

export type ListProps = {
  items?: CardItem[];
  isLoading?: boolean;
  view?: ListView;
  emptyTitle?: string;
  emptyBody?: string;
  onToggleFavorite?: CardActionHandlers["onToggleFavorite"];
  isUpdating?: boolean;
  renderItem?: (item: CardItem) => ReactNode;
  skeletonCount?: number;
};
