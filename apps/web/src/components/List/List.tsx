"use client";
import Card from "@/components/Card/Card";
import { CardSkeleton } from "@/components/Card/CardSkeleton";
import EmptyState from "@/components/EmptyState";
import { ListProps } from "./List.types";

export default function List({
  items = [],
  isLoading = false,
  view = "grid",
  emptyTitle = "No items",
  emptyBody = "Try adjusting your filters or check back later.",
  onToggleFavorite,
  onSelect,
  isUpdating = false,
  renderItem,
  skeletonCount = 6,
}: ListProps) {
  const layout = `grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`;

  if (isLoading) {
    const skeletons = Array.from({ length: skeletonCount }).map((_, i) => <CardSkeleton key={i} />);
    return <div className={layout}>{skeletons}</div>;
  }

  if (!items || items.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />;
  }

  return (
    <div className={layout} role="list">
      {items.map((item) => (
        <div key={item.id} role="listitem">
          {renderItem ? (
            renderItem(item)
          ) : (
            <Card
              item={item}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelect}
              isUpdating={isUpdating}
            />
          )}
        </div>
      ))}
    </div>
  );
}
