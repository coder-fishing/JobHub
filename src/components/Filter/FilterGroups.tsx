import { useState, useEffect } from 'react';
import { CheckboxFilterProps, RangeFilterProps } from './types';
import { useDebounce } from '@/hooks/useDebounce';

export function CheckboxFilterGroup({ title, options, selectedValues, onChange }: CheckboxFilterProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center justify-between cursor-pointer group gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={(e) => onChange(opt.value, e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30 shrink-0"
              />
              <span className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-900 transition-colors truncate">
                {opt.label}
              </span>
            </div>
            {opt.count !== undefined && (
              <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                {opt.count}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export const RangeFilterGroup = ({ title, min, max, value, onChange, unit }: RangeFilterProps) => {
  // Local state giúp thanh slider di chuyển siêu mượt 60fps trên màn hình
  const [localValue, setLocalValue] = useState<number>(value);
  
  // Áp dụng hook useDebounce (trễ 400ms)
  const debouncedValue = useDebounce(localValue, 400);

  // Đồng bộ nếu parent reset lại value
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  // Chỉ khi người dùng dừng kéo 400ms mới kích hoạt callback lọc/gọi API
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
      console.log('⚡ [Debounced] Đã lọc dự án theo mức giá:', debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">{title}</h4>
        <span className="text-xs font-medium text-emerald-600">
          Tối đa {localValue.toLocaleString('vi-VN')} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1000000}
        value={localValue}
        onChange={(e) => {
          const val = Number(e.target.value);
          setLocalValue(val);
          console.log('🔄 [Đang kéo Slider]:', val.toLocaleString('vi-VN'), unit);
        }}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
}

