'use client';

import { JobCard } from '@/components/Card/JobCard';
import { JobCardSkeleton } from '@/components/Card/Skeletons';
import JobFilterSidebar from '@/components/Filter/JobFilterSidebar';
import { RefreshCw } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { JobsHeaderBanner, EmptyJobList } from '@/components/jobs/list';

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
                className="inline-flex items-center space-x-1 text-slate-500 hover:text-emerald-600 font-medium transition-colors"
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
                {projects.map((project) => (
                  <JobCard key={project.id} project={project} />
                ))}
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
