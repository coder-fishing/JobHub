'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProjectResponse } from '@/types/api';
import { JobCardSkeleton } from '@/components/ui/Skeletons';
import { projectService } from '@/services/projectService';
import {
  JobDetailHeader,
  JobDetailDescription,
  JobProposalForm,
  JobClientSidebar,
  JobNotFound,
} from '@/components/features/jobs/detail';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    projectService.getProjectById(id).then((data) => {
      if (isMounted) {
        setProject(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleProposalSubmit = async (proposal: { proposalBid: string; coverLetter: string }) => {
    await projectService.submitProposal({
      projectId: id,
      ...proposal,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <JobCardSkeleton />
      </div>
    );
  }

  if (!project) {
    return <JobNotFound />;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách việc làm</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Detail Section (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <JobDetailHeader project={project} />
            <JobDetailDescription project={project} />
            <JobProposalForm
              initialBid={project.budget.toString()}
              onSubmit={handleProposalSubmit}
            />
          </div>

          {/* Sidebar Right (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <JobClientSidebar
              clientEmail={project.clientEmail}
              clientId={project.clientId}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
