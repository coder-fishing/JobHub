import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
}

export function FormInput({
  label,
  required,
  icon: Icon,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 ${
            Icon ? 'pl-10' : ''
          } ${className}`}
        />
        {Icon && (
          <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  required,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        {...props}
        className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-4 focus:outline-none focus:border-emerald-500 ${className}`}
      />
    </div>
  );
}
