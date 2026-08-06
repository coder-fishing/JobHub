'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ContractResponse } from '@/types/api';
import { contractService } from '@/services/contractService';
import {
  ContractHeader,
  MilestoneList,
} from '@/components/features/contracts';

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    contractService.getContractById(id).then((data) => {
      if (isMounted) {
        setContract(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleLockEscrow = async (milestoneId: number) => {
    if (!contract) return;
    const updated = await contractService.lockMilestoneEscrow(contract.id, milestoneId);
    setContract(updated);
  };

  const handleSubmitWork = async (milestoneId: number) => {
    if (!contract) return;
    const updated = await contractService.submitMilestoneWork(contract.id, milestoneId);
    setContract(updated);
  };

  const handleReleaseFunds = async (milestoneId: number) => {
    if (!contract) return;
    const updated = await contractService.releaseMilestoneFunds(contract.id, milestoneId);
    setContract(updated);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-64" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Hợp đồng không tồn tại</h2>
        <p className="text-sm text-slate-500">Mã hợp đồng này không đúng hoặc không có quyền truy cập.</p>
        <Link href="/dashboard" className="inline-block bg-slate-900 text-white font-medium text-sm px-6 py-2.5 rounded-xl">
          Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Dashboard Quản lý</span>
          </Link>
        </div>

        {/* Contract Header */}
        <ContractHeader contract={contract} />

        {/* Milestones & Escrow */}
        <MilestoneList
          milestones={contract.milestones}
          onLockEscrow={handleLockEscrow}
          onSubmitWork={handleSubmitWork}
          onReleaseFunds={handleReleaseFunds}
        />
      </div>
    </div>
  );
}
