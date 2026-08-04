import { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CheckboxFilterGroup, RangeFilterGroup } from '@/components/Filter/FilterGroups';

interface JobFilterSidebarProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string, checked: boolean) => void;
  onSkillChange: (skill: string, checked: boolean) => void;
  onBudgetChange: (budget: number) => void;
  onReset: () => void;
  selectedStatuses: string[];
  selectedSkills: string[];
  maxBudget: number;
}

const STATUS_OPTIONS = [
  { label: 'Đang tuyển (OPEN)', value: 'OPEN', count: 12 },
  { label: 'Đang thực hiện (IN_PROGRESS)', value: 'IN_PROGRESS', count: 8 },
  { label: 'Đã hoàn thành (COMPLETED)', value: 'COMPLETED', count: 24 },
];

const POPULAR_SKILLS = [
  { label: 'Next.js', value: 'Next.js', count: 15 },
  { label: 'React', value: 'React', count: 22 },
  { label: 'Spring Boot', value: 'Spring Boot', count: 18 },
  { label: 'TypeScript', value: 'TypeScript', count: 19 },
  { label: 'Figma', value: 'Figma', count: 10 },
  { label: 'Java', value: 'Java', count: 14 },
  { label: 'Docker', value: 'Docker', count: 8 },
];

export default function JobFilterSidebar({
  onSearchChange,
  onStatusChange,
  onSkillChange,
  onBudgetChange,
  onReset,
  selectedStatuses,
  selectedSkills,
  maxBudget
}: JobFilterSidebarProps) {
  return (
    <aside className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2 font-bold text-slate-900 text-base">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Bộ Lọc Tìm Kiếm</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-emerald-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="text-xs font-medium hover:cursor-pointer">Đặt lại</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
          Từ khóa dự án
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên, mô tả..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Status Filter */}
      <CheckboxFilterGroup
        title="Trạng thái dự án"
        options={STATUS_OPTIONS}
        selectedValues={selectedStatuses}
        onChange={onStatusChange}
      />

      {/* Skills Filter */}
      <CheckboxFilterGroup
        title="Kỹ năng yêu cầu"
        options={POPULAR_SKILLS}
        selectedValues={selectedSkills}
        onChange={onSkillChange}
      />

      {/* Budget Filter */}
      <RangeFilterGroup
        title="Ngân sách tối đa"
        min={5000000}
        max={100000000}
        value={maxBudget}
        unit="VNĐ"
        onChange={onBudgetChange}
      />
    </aside>
  );
}
