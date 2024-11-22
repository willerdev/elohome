export function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2 hidden md:block">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      <div className="hidden md:block h-4 w-28 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
