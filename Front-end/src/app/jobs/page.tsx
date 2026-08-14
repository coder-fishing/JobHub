'use client';

import { JobCard } from '@/components/features/jobs/JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeletons';
import JobFilterSidebar from '@/components/features/jobs/JobFilterSidebar';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'; //  1. Thêm icon nút chuyển trang
import { useProjects } from '@/hooks/useProjects';
import { JobsHeaderBanner, EmptyJobList } from '@/components/features/jobs/list';

export default function JobsPage() {
  const {
    projects,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStatuses,
    selectedSkills,
    maxBudget,
    setMaxBudget,
    sortBy,
    setSortBy,
    handleStatusChange,
    handleSkillChange,
    handleResetFilters,
    refetch,
    //  2. Lấy thêm các biến phân trang từ custom hook
    page = 0,
    totalPages = 1,
    setPage,
  } = useProjects();

  return (
    <div>
      {/* Header Banner */}
      <JobsHeaderBanner sortBy={sortBy} onSortChange={setSortBy} />

      {/* Main Content Explorer */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-4 xl:col-span-3">
            <JobFilterSidebar
              onSearchChange={setSearchQuery}
              onStatusChange={handleStatusChange}
              onSkillChange={handleSkillChange}
              onBudgetChange={setMaxBudget}
              onReset={handleResetFilters}
              selectedStatuses={selectedStatuses}
              selectedSkills={selectedSkills}
              maxBudget={maxBudget}
            />
          </div>

          {/* Job List Container */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
              <span>
                Hiển thị <strong>{isLoading ? '...' : projects.length}</strong> dự án phù hợp
              </span>
              <button
                onClick={refetch}
                className="inline-flex items-center space-x-1 text-slate-500 hover:text-emerald-600 font-medium transition-colors cursor-pointer"
                title="Tải lại dữ liệu"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
                <span>Tải lại</span>
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {/* Danh sách bài đăng */}
                {projects.map((project) => (
                  <JobCard key={project.id} project={project} />
                ))}

                {/*  3. THANH PHÂN TRANG (PAGINATION) */}
                {totalPages >= 1 && (
                  <div className="flex items-center justify-center space-x-2 pt-8 pb-4">
                    {/* Nút Trang Trước */}
                    <button
                      disabled={page === 0}
                      onClick={() => setPage && setPage(page - 1)}
                      className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Trước</span>
                    </button>

                    {/* Danh sách các số trang */}
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setPage && setPage(index)}
                        className={`w-8 h-8 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          page === index
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    {/* Nút Trang Sau */}
                    <button
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage && setPage(page + 1)}
                      className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <span>Sau</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyJobList onResetFilters={handleResetFilters} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}