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
  const [role, setRole] = useState<'client' | 'freelancer' | null>(null);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      try {
        const res = await fetch('http://localhost:8080/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error('Token expired or invalid');
        }
        
        const data = await res.json();
        if (isMounted) {
          setRole(data.role.toLowerCase() as 'client' | 'freelancer');
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        window.location.href = '/login';
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!role) return;
    let isMounted = true;
    setIsLoading(true);

    if (role === 'client') {
      Promise.all([
        projectService.getProjects({ myProjects: true }),
        proposalService.getClientProposals(),
      ]).then(([projData, propData]) => {
        if (isMounted) {
          setProjects(projData);
          setProposals(propData);
          setIsLoading(false);
        }
      }).catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          alert('Bạn không có quyền truy cập dữ liệu này.');
          if (isMounted) setIsLoading(false);
        } else {
          alert('Có lỗi xảy ra khi tải dữ liệu.');
          if (isMounted) setIsLoading(false);
        }
      });
    } else {
      proposalService.getFreelancerProposals().then((propData) => {
        if (isMounted) {
          setProposals(propData);
          setIsLoading(false);
        }
      }).catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          alert('Bạn không có quyền truy cập dữ liệu này.');
          if (isMounted) setIsLoading(false);
        } else {
          alert('Có lỗi xảy ra khi tải dữ liệu.');
          if (isMounted) setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [role]);

  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleAcceptProposal = async (proposalId: number) => {
    try {
      setProcessingId(proposalId);
      await proposalService.updateProposalStatus(proposalId, 'ACCEPTED');
      const refreshedProposals = await proposalService.getClientProposals();
      setProposals(refreshedProposals);
    } catch (error: any) {
      alert(error.message || 'Lỗi khi chấp nhận hồ sơ');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectProposal = async (proposalId: number) => {
    try {
      setProcessingId(proposalId);
      await proposalService.updateProposalStatus(proposalId, 'REJECTED');
      const refreshedProposals = await proposalService.getClientProposals();
      setProposals(refreshedProposals);
    } catch (error: any) {
      alert(error.message || 'Lỗi khi từ chối hồ sơ');
    } finally {
      setProcessingId(null);
    }
  };

  if (!role) {
    return (
      <div className="bg-slate-50 min-h-screen py-10 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Header */}
        <DashboardHeader
          role={role}
          onRoleChange={(newRole) => setRole(newRole as 'client' | 'freelancer')}
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
            processingProposalId={processingId}
          />
        ) : (
          <FreelancerDashboardView proposals={proposals} />
        )}
      </div>
    </div>
  );
}
