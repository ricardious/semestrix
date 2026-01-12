import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Input from "@atoms/Input";
import SvgIcon from "@atoms/SvgIcon";

interface SearchableSelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  disableFiltering?: boolean;
}

export default function SearchableSelect<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Seleccionar...",
  disabled = false,
  className,
  onSearch,
  isLoading = false,
  disableFiltering = false,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset query to current value label if closed without selecting
        if (value) {
          setQuery(getLabel(value));
        } else {
          setQuery("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, getLabel]);

  // Update query when value changes from outside
  useEffect(() => {
    if (value) {
      setQuery(getLabel(value));
    } else {
      setQuery("");
    }
  }, [value, getLabel]);

  const filteredOptions = useMemo(() => {
    if (disableFiltering) return options;
    if (!query) return options;
    return options.filter((option) =>
      getLabel(option).toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query, getLabel, disableFiltering]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!isOpen) setIsOpen(true);
    if (onSearch) onSearch(value);
  };

  const handleSelect = (option: T) => {
    onChange(option);
    setQuery(getLabel(option));
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className={clsx("relative w-full", className)}>
      <Input
        ref={inputRef}
        type="text"
        value={isOpen ? query : value ? getLabel(value) : ""}
        onChange={handleInputChange}
        onFocus={() => {
          setIsOpen(true);
          setQuery("");
        }}
        placeholder={placeholder}
        disabled={disabled}
        // Force active styles when open
        className={clsx(
          isOpen &&
            "border-primary ring-2 ring-primary/20 bg-base-100 dark:bg-base-dark/80"
        )}
        leftIcon={
          <SvgIcon
            name="search"
            className="h-5 w-5 text-base-content dark:text-base-dark-content"
          />
        }
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
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
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
                    <span>{getLabel(option)}</span>
                    {isSelected && (
                      <span className="text-primary">
                        <SvgIcon name="check" className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-center text-sm text-base-content/50">
                No se encontraron resultados
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
