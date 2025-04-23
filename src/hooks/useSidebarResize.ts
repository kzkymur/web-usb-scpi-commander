import { useState, useEffect } from 'react';
import { create } from 'zustand';

export const useSidebarResize = create(() => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const container = document.querySelector('#main-container') as HTMLElement;
      const newWidth = e.clientX - container.getBoundingClientRect().left;
      setSidebarWidth(Math.min(Math.max(newWidth, 250), 500));
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSidebarWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const sidebarRect = e.currentTarget.getBoundingClientRect();
    const handleArea = 8;
    if (e.clientX >= sidebarRect.right - handleArea && e.clientX <= sidebarRect.right + handleArea) {
      setIsDragging(true);
    }
  };

  return { sidebarWidth, handleMouseDown };
});