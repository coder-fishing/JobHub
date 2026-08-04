import { CheckCircle2 } from 'lucide-react';

interface StepItemProps {
  step: string;
  title: string;
  description: string;
}

export function StepItem({ step, title, description }: StepItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-slate-900 font-semibold text-base">{step}. {title}</h4>
        <p className="text-slate-500 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
}
