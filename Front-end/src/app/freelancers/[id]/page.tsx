'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FreelancerProfileResponse } from '@/types/api';
import { freelancerService } from '@/services/freelancerService';
import {
  FreelancerDetailHeader,
  FreelancerDetailInfo,
  FreelancerDetailSidebar,
  FreelancerNotFound,
} from '@/components/features/freelancers/detail';

export default function FreelancerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [freelancer, setFreelancer] = useState<FreelancerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHired, setIsHired] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    freelancerService.getFreelancerById(id).then((data) => {
      if (isMounted) {
        setFreelancer(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-64" />
      </div>
    );
  }

  if (!freelancer) {
    return <FreelancerNotFound />;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/freelancers"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách Freelancers</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <FreelancerDetailHeader
          freelancer={freelancer}
          isHired={isHired}
          onHire={() => setIsHired(true)}
        />

        {/* Bio & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Bio & Skills */}
          <div className="md:col-span-2">
            <FreelancerDetailInfo freelancer={freelancer} />
          </div>

          {/* Right Column: Sidebar Info */}
          <div>
            <FreelancerDetailSidebar freelancer={freelancer} />
          </div>
        </div>

      </div>
    </div>
  );
}
