'use client';

import { useState, useEffect } from 'react';
import { ProjectResponse, ProposalResponse } from '@/types/api';
import { projectService } from '@/services/projectService';
import { proposalService } from '@/services/proposalService';
import {
  DashboardHeader,
  ClientDashboardView,
  FreelancerDashboardView,
} from '@/components/features/dashboard';

export default function DashboardPage() {
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (role === 'client') {
      Promise.all([
        projectService.getProjects(),
        proposalService.getClientProposals(),
      ]).then(([projData, propData]) => {
        if (isMounted) {
          setProjects(projData);
          setProposals(propData);
          setIsLoading(false);
        }
      });
    } else {
      proposalService.getFreelancerProposals().then((propData) => {
        if (isMounted) {
          setProposals(propData);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [role]);

  const handleAcceptProposal = async (proposalId: number) => {
    const updated = await proposalService.updateProposalStatus(proposalId, 'ACCEPTED');
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? updated : p))
    );
  };

  const handleRejectProposal = async (proposalId: number) => {
    const updated = await proposalService.updateProposalStatus(proposalId, 'REJECTED');
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? updated : p))
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Header */}
        <DashboardHeader
          role={role}
          onRoleChange={setRole}
          totalProjects={role === 'client' ? projects.length : 0}
          totalProposals={proposals.length}
        />

        {/* View Selection */}
        {isLoading ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 h-80 animate-pulse" />
        ) : role === 'client' ? (
          <ClientDashboardView
            projects={projects}
            proposals={proposals}
            onAcceptProposal={handleAcceptProposal}
            onRejectProposal={handleRejectProposal}
          />
        ) : (
          <FreelancerDashboardView proposals={proposals} />
        )}
      </div>
    </div>
  );
}
