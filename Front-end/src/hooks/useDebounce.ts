import { useState, useEffect } from 'react';

/**
 * Custom Hook useDebounce giúp hoãn việc bắn sự kiện / gọi API
 * cho tới khi người dùng ngừng thao tác trong khoảng thời gian delay (mặc định 400ms)
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
