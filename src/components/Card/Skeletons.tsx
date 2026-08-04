export function JobCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs animate-pulse flex flex-col sm:flex-row sm:items-start justify-between gap-6">
      <div className="space-y-3.5 flex-1 w-full">
        {/* Top Badges Skeleton */}
        <div className="flex items-center space-x-3">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-4 w-36 bg-slate-100 rounded-md" />
          <div className="h-4 w-28 bg-slate-100 rounded-md" />
        </div>

        {/* Title Skeleton */}
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />

        {/* Description Lines Skeleton */}
        <div className="space-y-2 pt-1">
          <div className="h-4 w-full bg-slate-100 rounded-md" />
          <div className="h-4 w-2/3 bg-slate-100 rounded-md" />
        </div>

        {/* Budget & Applicants Skeleton */}
        <div className="flex items-center space-x-6 pt-1">
          <div className="h-5 w-32 bg-emerald-100/60 rounded-md" />
          <div className="h-4 w-28 bg-slate-100 rounded-md" />
        </div>

        {/* Skill Badges Skeleton */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-6 w-16 bg-slate-100 rounded-lg" />
          <div className="h-6 w-20 bg-slate-100 rounded-lg" />
          <div className="h-6 w-24 bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="shrink-0 w-full sm:w-auto pt-4 sm:pt-0">
        <div className="h-10 w-full sm:w-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 animate-pulse space-y-4">
      <div className="w-12 h-12 rounded-xl bg-slate-200" />
      <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
      <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
    </div>
  );
}

export function FreelancerCardSkeleton() {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-pulse space-y-5">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
        <div className="space-y-2 w-full">
          <div className="h-5 w-1/2 bg-slate-200 rounded-md" />
          <div className="h-3 w-3/4 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-200 flex justify-between">
        <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
        <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-slate-100 rounded-md" />
        <div className="h-5 w-16 bg-slate-100 rounded-md" />
      </div>
      <div className="h-9 w-full bg-slate-200 rounded-xl" />
    </div>
  );
}
