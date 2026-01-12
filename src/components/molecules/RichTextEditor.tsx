import { useRef } from "react";
import { clsx } from "clsx";
import SvgIcon from "@atoms/SvgIcon";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  rows = 10,
  className,
  label,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClear = () => {
    onChange("");
    textareaRef.current?.focus();
  };

  const handleCopy = async () => {
    try {
      if (value) {
        await navigator.clipboard.writeText(value);
      }
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(value ? value + "\n" + text : text);
      }
    } catch (err) {
      console.error("Failed to paste", err);
      textareaRef.current?.focus();
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col overflow-hidden rounded-xl border-2 transition-colors duration-300",
        "border-base-content/10 bg-base-100",
        "dark:border-base-dark-content/10 dark:bg-base-dark",
        "focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-base-content/10 bg-base-200/50 px-4 py-2 dark:border-base-dark-content/10 dark:bg-base-dark-content/5">
        <span className="text-xs font-semibold uppercase tracking-wider text-base-content/50 dark:text-base-dark-content/50">
          {label || "Editor de texto"}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            type="button"
            title="Copiar contenido"
            disabled={!value}
            className="rounded-lg p-1.5 text-base-content/60 transition-colors hover:bg-base-content/10 hover:text-primary disabled:opacity-30 dark:text-base-dark-content/60 dark:hover:bg-base-dark-content/10"
          >
            <span className="text-xs font-medium">Copiar</span>
          </button>
          <div className="mx-1 h-4 w-px bg-base-content/10 dark:bg-base-dark-content/10"></div>
          <button
            onClick={handlePaste}
            type="button"
            title="Pegar desde portapapeles"
            className="rounded-lg p-1.5 text-base-content/60 transition-colors hover:bg-base-content/10 hover:text-primary dark:text-base-dark-content/60 dark:hover:bg-base-dark-content/10"
          >
            <span className="text-xs font-medium">Pegar</span>
          </button>
          <div className="mx-1 h-4 w-px bg-base-content/10 dark:bg-base-dark-content/10"></div>
          <button
            onClick={handleClear}
            type="button"
            title="Limpiar todo"
            disabled={!value}
            className="group rounded-lg p-1.5 text-base-content/60 transition-colors hover:bg-error/10 hover:text-error disabled:opacity-30 dark:text-base-dark-content/60"
          >
            <SvgIcon name="x" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={clsx(
            "custom-scrollbar w-full resize-y border-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none",
            "text-base-content placeholder:text-base-content/30",
            "dark:text-base-dark-content dark:placeholder:text-base-dark-content/30"
          )}
        />

        {/* Footer/Status */}
        <div className="flex justify-end px-4 py-2 text-xs text-base-content/40 dark:text-base-dark-content/40">
          {value.length} caracteres
        </div>
      </div>
    </div>
  );
}
