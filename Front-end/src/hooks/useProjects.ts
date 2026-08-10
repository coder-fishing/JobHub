'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProjectResponse } from '@/types/api';
import { projectService, ProjectFilterParams } from '@/services/projectService';

export function useProjects(initialParams?: ProjectFilterParams) {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState(initialParams?.searchQuery || '');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialParams?.statuses || ['OPEN']
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialParams?.skills || []
  );
  const [maxBudget, setMaxBudget] = useState<number>(
    initialParams?.maxBudget || 100000000
  );
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>(
    initialParams?.sortBy || 'newest'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await projectService.getProjects({
        searchQuery,
        statuses: selectedStatuses,
        skills: selectedSkills,
        maxBudget,
        sortBy,
      });
      setProjects(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải dự án');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatuses, selectedSkills, maxBudget, sortBy]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
  };
}
