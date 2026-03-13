'use client';

import { useEffect } from 'react';

/**
 * PhotoProtection
 * Disables right-click context menu on every <img> element across the site.
 * Prevents casual "Save Image As…" from the browser context menu.
 */
export default function PhotoProtection() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Block drag-to-save on images
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  // This component renders nothing — it's purely a side-effect hook
  return null;
}
