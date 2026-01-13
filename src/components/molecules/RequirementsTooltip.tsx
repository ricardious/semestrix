import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import SvgIcon from "@atoms/SvgIcon";

interface RequirementsTooltipProps {
  missingRequirements: string[];
}

/**
 * Requirements tooltip component
 * - Desktop: Shows tooltip on hover
 * - Mobile: Opens modal on click
 */
export default function RequirementsTooltip({
  missingRequirements,
}: RequirementsTooltipProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // Update tooltip position on hover
  useEffect(() => {
    if (isHovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 8, // Position above the button
        left: rect.left + rect.width / 2, // Center horizontally
      });
    }
  }, [isHovered]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isModalOpen]);

  // Close modal on scroll
  useEffect(() => {
    if (isModalOpen) {
      const handleScroll = () => setIsModalOpen(false);
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [isModalOpen]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Only open modal on mobile (no hover capability)
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="p-1 -m-1 rounded-lg transition-colors hover:bg-base-content/10 dark:hover:bg-white/10 active:bg-base-content/20 dark:active:bg-white/20"
        aria-label="Ver requisitos faltantes"
      >
        <SvgIcon
          name="padlock-square-1"
          className="text-lg text-base-content/50 dark:text-base-dark-content/50"
        />
      </button>

      {/* Desktop: Hover tooltip via Portal */}
      {isHovered &&
        createPortal(
          <DesktopTooltip
            missingRequirements={missingRequirements}
            position={tooltipPosition}
          />,
          document.body
        )}

      {/* Mobile: Click modal via Portal */}
      {isModalOpen &&
        createPortal(
          <MobileModal
            ref={tooltipRef}
            missingRequirements={missingRequirements}
            onClose={() => setIsModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
}

/**
 * Desktop tooltip - shown on hover
 */
function DesktopTooltip({
  missingRequirements,
  position,
}: {
  missingRequirements: string[];
  position: { top: number; left: number };
}) {
  return (
    <div
      className="hidden md:block fixed z-[9999] pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="bg-neutral dark:bg-base-dark text-neutral-content dark:text-base-dark-content rounded-xl shadow-xl border border-white/10 p-3 max-w-xs animate-in fade-in zoom-in-95 duration-150">
        <p className="font-bold text-xs mb-2 text-error flex items-center gap-1.5">
          <SvgIcon name="padlock-square-1" className="text-sm" />
          Requisitos faltantes
        </p>
        <ul className="space-y-1">
          {missingRequirements.map((req, i) => (
            <li key={i} className="text-xs flex items-start gap-2">
              <span className="text-error">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
        {/* Arrow */}
        <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-neutral dark:bg-base-dark border-r border-b border-white/10" />
      </div>
    </div>
  );
}

/**
 * Mobile modal - shown on click
 */
const MobileModal = ({
  ref,
  missingRequirements,
  onClose,
}: {
  ref: React.Ref<HTMLDivElement>;
  missingRequirements: string[];
  onClose: () => void;
}) => {
  return (
    <div className="md:hidden fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={ref}
        className={clsx(
          "relative z-10 w-full max-w-sm rounded-2xl shadow-2xl border",
          "bg-base-100 dark:bg-base-dark border-base-content/10 dark:border-white/10",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-content/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-error/10">
              <SvgIcon name="padlock-square-1" className="text-xl text-error" />
            </div>
            <div>
              <h3 className="font-bold text-base text-base-content dark:text-base-dark-content">
                Requisitos faltantes
              </h3>
              <p className="text-xs text-base-content/60 dark:text-base-dark-content/60">
                Debes aprobar estos cursos primero
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-base-content/10 dark:hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-base-content/60 dark:text-base-dark-content/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-3">
            {missingRequirements.map((req, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-error/5 dark:bg-error/10 border border-error/10"
              >
                <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-error text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-sm text-base-content dark:text-base-dark-content">
                  {req}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-content/10 dark:border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
