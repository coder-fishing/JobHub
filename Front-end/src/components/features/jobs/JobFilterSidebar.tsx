'use client';

import { useState, useEffect } from 'react';
import { CheckboxFilterGroup, RangeFilterGroup } from './FilterGroups';
import { projectService, ProjectFilterStats } from '@/services/projectService'; // 🟢 1. Import projectService
import { Search, SlidersHorizontal, RotateCcw, Plus, Check } from 'lucide-react';

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
  // 🟢 2. State lưu dữ liệu số đếm đếm từ Backend API
  const [stats, setStats] = useState<ProjectFilterStats | null>(null);

  // chèn thêm
  // State quản lý
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherSkillValue, setOtherSkillValue] = useState('');

  // Hàm xử lý khi gõ phím -> Lọc realtime lập tức
  const handleOtherSkillChange = (value: string) => {
    const previousValue = otherSkillValue.trim();
    const newValue = value.trim();

    setOtherSkillValue(value); // Cập nhật state input

    // Nếu đã tick ô "Khác..." thì gọi lọc ngay lập tức theo từng phím gõ
    if (isOtherChecked) {
      if (previousValue) {
        onSkillChange(previousValue, false); // Hủy lọc từ cũ
      }
      if (newValue) {
        onSkillChange(newValue, true); // Áp dụng lọc từ mới ngay lập tức
      }
    }
  };

  useEffect(() => {
    // 🟢 Gọi API lấy số dư từ DB khi load sidebar
    projectService.getFilterStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Lỗi lấy thống kê bộ lọc:", err));
  }, []);


 

  // 🟢 3. Danh sách Options lấy số count động từ stats
  const statusOptions = [
    { label: 'Đang tuyển (OPEN)', value: 'OPEN', count: stats?.statusCounts?.['OPEN'] || 0 },
    { label: 'Đang thực hiện (IN_PROGRESS)', value: 'IN_PROGRESS', count: stats?.statusCounts?.['IN_PROGRESS'] || 0 },
    { label: 'Đã hoàn thành (COMPLETED)', value: 'COMPLETED', count: stats?.statusCounts?.['COMPLETED'] || 0 },
  ];

  const popularSkills = [
    { label: 'Next.js', value: 'Next.js', count: stats?.skillCounts?.['Next.js'] || 0 },
    { label: 'React', value: 'React', count: stats?.skillCounts?.['React'] || 0 },
    { label: 'Spring Boot', value: 'Spring Boot', count: stats?.skillCounts?.['Spring Boot'] || 0 },
    { label: 'TypeScript', value: 'TypeScript', count: stats?.skillCounts?.['TypeScript'] || 0 },
    { label: 'Figma', value: 'Figma', count: stats?.skillCounts?.['Figma'] || 0 },
    { label: 'Java', value: 'Java', count: stats?.skillCounts?.['Java'] || 0 },
    { label: 'Docker', value: 'Docker', count: stats?.skillCounts?.['Docker'] || 0 },
  ];


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
        options={statusOptions} // 🟢 Đã đổi sang statusOptions chứa count động
        selectedValues={selectedStatuses}
        onChange={onStatusChange}
      />

      {/* Skills Filter */}
      <CheckboxFilterGroup
        title="Kỹ năng yêu cầu"
        options={popularSkills} // 🟢 Đã đổi sang popularSkills chứa count động
        selectedValues={selectedSkills}
        onChange={onSkillChange}
      />

      {/* giao dien phan other skill */}
      <div className="pt-2 space-y-2.5">
        <label className="flex items-center space-x-2.5 text-sm font-medium text-slate-700 cursor-pointer select-none hover:text-emerald-600 transition-colors">
          <input
            type="checkbox"
            checked={isOtherChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsOtherChecked(checked);
              const trimmed = otherSkillValue.trim();

              if (checked && trimmed) {
                onSkillChange(trimmed, true); // Tick vào -> kích hoạt lọc ngay
              } else if (!checked && trimmed) {
                onSkillChange(trimmed, false); // Bỏ tick -> bỏ lọc ngay
              }
            }}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 transition-all cursor-pointer"
          />
          <span>Kỹ năng khác...</span>
        </label>

        {/* Ô Input làm mới: Thiết kế hiện đại, có icon kính lúp nhỏ */}
        {isOtherChecked && (
          <div className="pl-6 pt-0.5">
            <div className="relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Nhập skill (VD: MySQL, Python)..."
                value={otherSkillValue}
                onChange={(e) => handleOtherSkillChange(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 font-medium shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

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