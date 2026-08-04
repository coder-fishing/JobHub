import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  index: number;
  title: string;
  count: string;
  color: string;
  icon: LucideIcon;
}

export const CategoryCard = ({ index, title, count, color, icon: IconComponent }: CategoryCardProps) => {
  return (
    <Link
      href={`/jobs/category/${index}`}
      className="group bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-white hover:shadow-lg transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl border ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="text-slate-900 font-semibold text-lg group-hover:text-emerald-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-xs mt-1.5">{count}</p>
    </Link>
  );
}