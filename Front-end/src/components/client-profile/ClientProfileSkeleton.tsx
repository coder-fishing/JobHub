import React from 'react';

export function ClientProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 animate-pulse">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 h-48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-96 lg:col-span-2" />
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-96" />
      </div>
    </div>
  );
}
