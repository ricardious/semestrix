import { clsx } from "clsx";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export default function Badge({
  label,
  variant = "neutral",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-semibold capitalize tracking-wide transition-colors",
        // Sizes
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-0.5 text-xs",
        size === "lg" && "px-3 py-1 text-sm",
        // Variants
        variant === "success" &&
          "bg-success/15 text-success-content dark:bg-success/10 dark:text-success",
        variant === "warning" &&
          "bg-warning/15 text-warning-content dark:bg-warning/10 dark:text-warning",
        variant === "error" &&
          "bg-error/15 text-error-content dark:bg-error/10 dark:text-error",
        variant === "info" &&
          "bg-info/15 text-info-content dark:bg-info/10 dark:text-info",
        variant === "neutral" &&
          "bg-base-content/10 text-base-content/70 dark:bg-base-dark-content/10 dark:text-base-dark-content/70",
        className
      )}
    >
      {label}
    </span>
  );
}
