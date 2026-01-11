import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Input from "@atoms/Input";
import SvgIcon from "@atoms/SvgIcon";

interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Seleccionar...",
  disabled = false,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx("relative w-full", className)}>
      <div onClick={() => !disabled && setIsOpen(!isOpen)}>
        <Input
          type="text"
          value={value ? getLabel(value) : ""}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={clsx(
            "cursor-pointer caret-transparent",
            isOpen &&
              "border-primary ring-2 ring-primary/20 bg-base-100 dark:bg-base-dark/80"
          )}
          rightIcon={
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <SvgIcon
                name="chevron-down"
                className="h-5 w-5 text-base-content dark:text-base-dark-content"
              />
            </motion.div>
          }
        />
      </div>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-base-content/10 bg-base-100/95 p-1 shadow-lg backdrop-blur-md dark:bg-base-dark/95 custom-scrollbar"
          >
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected =
                  value && getValue(value) === getValue(option);
                return (
                  <button
                    key={getValue(option)}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-base-content hover:bg-base-content/5 dark:text-base-dark-content"
                    )}
                  >
                    <span className="truncate">{getLabel(option)}</span>
                    {isSelected && (
                      <span className="ml-2 text-primary shrink-0">
                        <SvgIcon name="check" className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-center text-sm text-base-content/50">
                No hay opciones disponibles
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
