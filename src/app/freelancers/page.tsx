'use client';

import { Search, RefreshCw } from 'lucide-react';
import { useFreelancers } from '@/hooks/useFreelancers';
import {
  FreelancerCard,
  FreelancersHeaderBanner,
  EmptyFreelancerList,
} from '@/components/features/freelancers';

export default function FreelancersPage() {
  const {
    freelancers,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    handleResetFilters,
    refetch,
  } = useFreelancers();

  return (
    <div>
      {/* Header Banner */}
      <FreelancersHeaderBanner sortBy={sortBy} onSortChange={setSortBy} />

      {/* Main Content Explorer */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên, chức danh, kỹ năng (Next.js, Figma...)"
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>
              Hiển thị <strong>{isLoading ? '...' : freelancers.length}</strong> chuyên gia
            </span>
            <button
              onClick={refetch}
              className="inline-flex items-center space-x-1 text-slate-500 hover:text-emerald-600 font-medium transition-colors"
              title="Tải lại dữ liệu"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isLoading ? 'animate-spin text-emerald-600' : ''
                }`}
              />
              <span>Tải lại</span>
            </button>
          </div>
        </div>

        {/* Freelancers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 p-6 h-64 animate-pulse space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded-full w-2/3" />
                    <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-8 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : freelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        ) : (
          <EmptyFreelancerList onReset={handleResetFilters} />
        )}

      </main>
    </div>
  );
}
