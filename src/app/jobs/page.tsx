'use client';

import { useState, useMemo, useEffect } from 'react';
import { JobCard } from '@/components/Card/JobCard';
import { JobCardSkeleton } from '@/components/Card/Skeletons';
import JobFilterSidebar from '@/components/Filter/JobFilterSidebar';
import { MOCK_PROJECTS_API } from '@/constants';
import { Briefcase, ListFilter, RefreshCw } from 'lucide-react';

export default function JobsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['OPEN']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState<number>(100000000);
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>('newest');

  // Mô phỏng hiệu ứng Fetch API với Skeleton Loading (1.2 giây)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulateFetch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS_API.filter((project) => {
      // Search Query Filter
      if (
        searchQuery &&
        !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status Filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(project.status)) {
        return false;
      }

      // Budget Filter
      if (project.budget > maxBudget) {
        return false;
      }

      // Skills Filter
      if (selectedSkills.length > 0) {
        const projectSkills = project.requiredSkills.split(',').map((s) => s.trim().toLowerCase());
        const hasSkillMatch = selectedSkills.some((skill) =>
          projectSkills.includes(skill.toLowerCase())
        );
        if (!hasSkillMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'budget_high') return b.budget - a.budget;
      if (sortBy === 'budget_low') return a.budget - b.budget;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [searchQuery, selectedStatuses, selectedSkills, maxBudget, sortBy]);

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    setSelectedSkills((prev) =>
      checked ? [...prev, skill] : prev.filter((s) => s !== skill)
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatuses(['OPEN']);
    setSelectedSkills([]);
    setMaxBudget(100000000);
    setSortBy('newest');
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Khám phá cơ hội nghề nghiệp</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Danh Sách Dự Án Đang Tuyển</h1>
              <p className="text-sm text-slate-500 mt-1">
                Tìm kiếm và gửi báo giá cho các dự án công nghệ phù hợp nhất với chuyên môn của bạn
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
              <span className="text-xs text-slate-500 font-medium pl-2">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white text-xs font-medium text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="newest" className="text-slate-800 rounded-2xl ">
                  Mới nhất
                </option>
                <option value="budget_high" className="text-slate-800">
                  Ngân sách cao nhất
                </option>
                <option value="budget_low" className="text-slate-800">
                  Ngân sách thấp nhất
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

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
              <span>Hiển thị <strong>{isLoading ? '...' : filteredProjects.length}</strong> dự án phù hợp</span>
              <button
                onClick={handleSimulateFetch}
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
            ) : filteredProjects.length > 0 ? (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <JobCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <ListFilter className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Không tìm thấy dự án phù hợp</h3>
                  <p className="text-xs text-slate-500">Thử thay đổi từ khóa hoặc đặt lại bộ lọc tìm kiếm của bạn</p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 hover:cursor-pointer transition-colors shadow-sm shadow-slate-900/10"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
