import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function FormInput({
  label,
  required,
  icon: Icon,
  error,
  inputRef,
  className = '',
  ...props
}: FormInputProps) {
  const hasError = !!error;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          {...props}
          className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:bg-white ${
            hasError
              ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
              : 'border-slate-200 focus:border-emerald-500'
          } ${
            Icon ? 'pl-10' : ''
          } ${className}`}
        />
        {Icon && (
          <Icon className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${hasError ? 'text-rose-400' : 'text-slate-400'}`} />
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  inputRef?: React.Ref<HTMLTextAreaElement>;
}

export function FormTextarea({
  label,
  required,
  error,
  inputRef,
  className = '',
  ...props
}: FormTextareaProps) {
  const hasError = !!error;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        ref={inputRef}
        {...props}
        className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl p-4 focus:outline-none focus:bg-white ${
          hasError
            ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
            : 'border-slate-200 focus:border-emerald-500'
        } ${className}`}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
