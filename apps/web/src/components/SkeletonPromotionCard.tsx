export default function SkeletonPromotionCard() {
  return (
    <div role="status" aria-live="polite" className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-44 w-full bg-gray-200" />
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
