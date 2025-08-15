import { useState, useEffect } from 'react';

// Hook này nhận một giá trị và một khoảng thời gian trễ.
// Nó sẽ chỉ trả về giá trị mới nhất sau khi giá trị đó không thay đổi trong khoảng thời gian trễ đã cho.
export function useDebounce<T>(value: T, delay: number): T {
  // State để lưu trữ giá trị đã được trì hoãn
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Thiết lập một bộ đếm thời gian để cập nhật giá trị debounced sau khi hết thời gian trễ
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Dọn dẹp bộ đếm thời gian nếu giá trị thay đổi trước khi thời gian trễ kết thúc
      // Điều này đảm bảo rằng chúng ta chỉ cập nhật khi người dùng ngừng cung cấp giá trị mới
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Chỉ chạy lại effect nếu giá trị hoặc thời gian trễ thay đổi
  );

  return debouncedValue;
}
