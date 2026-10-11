import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'top' | 'bottom' }>({
    top: 0,
    left: 0,
    placement: 'bottom',
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    
    // Se c'è meno di 110px sopra rispetto al viewport, apri verso il basso
    const spaceAbove = rect.top;
    const placement: 'top' | 'bottom' = spaceAbove < 110 ? 'bottom' : 'top';

    const top = placement === 'top' ? rect.top - 8 : rect.bottom + 8;
    
    // Clamping orizzontale per evitare che esca a destra o a sinistra dello schermo
    const idealLeft = rect.left + rect.width / 2;
    const halfWidth = 115; // metà della larghezza del tooltip (230px / 2)
    const left = Math.max(halfWidth + 12, Math.min(window.innerWidth - halfWidth - 12, idealLeft));

    setCoords({ top, left, placement });
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, updatePosition]);

  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        ref={triggerRef}
        type="button"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        onMouseEnter={() => {
          updatePosition();
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => {
          updatePosition();
          setIsVisible((prev) => !prev);
        }}
        aria-label="Maggiori informazioni"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isVisible &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: coords.placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            }}
            className="z-[9999] w-60 p-2.5 bg-slate-900/95 dark:bg-slate-800/95 text-slate-100 text-xs rounded-xl shadow-2xl border border-slate-700/80 pointer-events-none animate-fadeIn backdrop-blur-md leading-relaxed"
          >
            {content}
            {/* Freccia indicatrice posizionata dinamicamente in alto o in basso */}
            {coords.placement === 'top' ? (
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95 dark:border-t-slate-800/95" />
            ) : (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-slate-900/95 dark:border-b-slate-800/95" />
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
