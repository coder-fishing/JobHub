'use client';

import React, { useState, KeyboardEvent } from 'react';
import { LucideIcon, X, Plus } from 'lucide-react';

interface SkillsInputProps {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  value: string; // Chuỗi các kỹ năng phân cách bằng dấu phẩy: "React, Next.js, Java"
  onChange: (newValue: string) => void;
  placeholder?: string;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function SkillsInput({
  label,
  required,
  icon: Icon,
  value,
  onChange,
  placeholder = 'Nhập kỹ năng rồi nhấn Enter hoặc dấu phẩy...',
  error,
  inputRef,
}: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const hasError = !!error;

  // Tách chuỗi thành mảng các tag
  const skillsList = value
    ? value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    // Tránh trùng lặp
    const exists = skillsList.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      const updatedList = [...skillsList, trimmed];
      onChange(updatedList.join(', '));
    }
    setInputValue('');
  };

  const removeSkill = (indexToRemove: number) => {
    const updatedList = skillsList.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedList.join(', '));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && skillsList.length > 0) {
      // Nhấn Xóa khi ô input trống thì xóa tag cuối cùng
      removeSkill(skillsList.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Input Field */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
            hasError
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'
          } ${
            Icon ? 'pl-10 pr-24' : 'pr-24'
          }`}
        />
        {Icon && (
          <Icon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${hasError ? 'text-rose-400' : 'text-slate-400'}`} />
        )}

        <button
          type="button"
          onClick={() => addSkill(inputValue)}
          disabled={!inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm</span>
        </button>
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {/* Render Tags */}
      {skillsList.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {skillsList.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs group animate-in fade-in zoom-in-95 duration-150"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-emerald-500 hover:text-rose-600 hover:bg-rose-50 rounded-md p-0.5 transition-colors"
                title="Xóa kỹ năng"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
