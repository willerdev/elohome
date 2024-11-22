export function ListingSkeleton() {
  return (
    <div className="flex-none w-[280px] md:w-[280px] w-[196px]">
      <div className="h-[210px] md:h-[210px] h-[147px] bg-gray-200 rounded-lg animate-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
