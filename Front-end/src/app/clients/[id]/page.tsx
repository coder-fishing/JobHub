'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { ClientProfileResponse, ClientJobHistoryDTO } from '@/types/api';
import {
  ClientProfileHeader,
  ClientBio,
  ClientJobHistory,
  ClientCompanyStats,
  ClientProfileSkeleton,
  ClientProfileError,
} from '@/components/client-profile';

export default function ClientPublicProfilePage() {
  const params = useParams();
  const clientId = params?.id as string;

  const [client, setClient] = useState<ClientProfileResponse | null>(null);
  const [jobs, setJobs] = useState<ClientJobHistoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileData, jobsData] = await Promise.all([
          clientService.getClientProfilePublic(clientId),
          clientService.getClientJobHistory(clientId).catch(() => []),
        ]);
        setClient(profileData);
        setJobs(jobsData);
      } catch (err: any) {
        console.error('Failed to load client profile:', err);
        setErrorMsg('Không thể tải thông tin doanh nghiệp.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  if (isLoading) {
    return <ClientProfileSkeleton />;
  }

  if (errorMsg || !client) {
    return <ClientProfileError errorMsg={errorMsg} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Button */}
        <div>
          <Link
            href="/jobs"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại tìm việc</span>
          </Link>
        </div>

        {/* Client Profile Header */}
        <ClientProfileHeader client={client} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ClientBio bio={client.bio} />
            <ClientJobHistory jobs={jobs} />
          </div>

          <ClientCompanyStats client={client} />
        </div>
      </div>
    </div>
  );
}
