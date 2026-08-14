'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'; //  1. THÊM IMPORT NÀY
import { ProjectResponse } from '@/types/api';
import { projectService, ProjectFilterParams } from '@/services/projectService';

export function useProjects(initialParams?: ProjectFilterParams) {
  const searchParams = useSearchParams(); // 2. KHỞI TẠO HOOK LẤY PARAM DỰA VÀO URL

  // khai báo các nút chuyển tab < >
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  // 1. Thêm state lưu tổng số dự án
  const [totalElements, setTotalElements] = useState<number>(0);

  // Lấy giá trị từ URL nếu có
  const urlSkill = searchParams.get('skills');
  const urlQuery = searchParams.get('searchQuery') || searchParams.get('keyword');

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Ưu tiên lấy từ URL trước, nếu không có mới lấy từ initialParams
  const [searchQuery, setSearchQuery] = useState(
    urlQuery || initialParams?.searchQuery || ''
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialParams?.statuses || ['OPEN']
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    urlSkill ? [urlSkill] : initialParams?.skills || []
  );
  const [maxBudget, setMaxBudget] = useState<number>(
    initialParams?.maxBudget || 100000000
  );
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>(
    initialParams?.sortBy || 'newest'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //  3. THÊM EFFECT NÀY: Tự động đồng bộ State mỗi khi URL thay đổi (VD: khi click tag ở trang chủ)
  useEffect(() => {
    const skillFromUrl = searchParams.get('skills');
    const queryFromUrl = searchParams.get('searchQuery') || searchParams.get('keyword');

    if (skillFromUrl) {
      setSelectedSkills([skillFromUrl]);
    }
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  const fetchProjects = useCallback(async () => {
  setIsLoading(true);
  setErrorMsg(null);
  try {
    const data: any = await projectService.getProjects({
      searchQuery,
      statuses: selectedStatuses,
      skills: selectedSkills,
      maxBudget,
      sortBy,
      page,
      size: 5,
    });

    //  XỬ LÝ CHUẨN XÁC DỮ LIỆU TỪ SPRING BOOT
    if (data && data.content) {
      // Khi API trả về dạng Spring Boot Page: { content: [...], totalElements: 6, totalPages: 2 }
      setProjects(data.content);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || data.content.length); //  Lấy đúng tổng số 6 từ Backend
    } else if (Array.isArray(data)) {
      // Nếu API trả về mảng trực tiếp chưa phân trang
      setProjects(data.slice(page * 5, page * 5 + 5));
      setTotalPages(Math.ceil(data.length / 5) || 1);
      setTotalElements(data.length); //  Lấy tổng độ dài cả mảng
    }
  } catch (err: any) {
    setErrorMsg(err.message || 'Lỗi khi tải dự án');
  } finally {
    setIsLoading(false);
  }
}, [searchQuery, selectedStatuses, selectedSkills, maxBudget, sortBy, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  //  CHỖ SỬA 2: Thêm setPage(0) khi thay đổi bộ lọc để luôn về trang 1
  const handleStatusChange = (status: string, checked: boolean) => {
    setPage(0);
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    setPage(0);
    setSelectedSkills((prev) =>
      checked ? [...prev, skill] : prev.filter((s) => s !== skill)
    );
  };

  const handleResetFilters = () => {
    setPage(0);
    setSearchQuery('');
    setSelectedStatuses(['OPEN']);
    setSelectedSkills([]);
    setMaxBudget(100000000);
    setSortBy('newest');
  };

  return {
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
    refetch: fetchProjects,
    errorMsg,
    page,
    totalPages,
    setPage,
  };
}