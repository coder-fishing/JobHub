import React from 'react';

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 h-32" />
      <div className="bg-white p-8 rounded-3xl border border-slate-200 h-96" />
    </div>
  );
}
