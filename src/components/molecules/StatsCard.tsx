import { ReactNode } from "react";
import { clsx } from "clsx";
import SvgIcon from "@atoms/SvgIcon";

export type StatsVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

interface StatsCardProps {
  label: string;
  value: string | number | ReactNode;
  icon: string;
  variant?: StatsVariant;
  className?: string;
  description?: string;
}

export default function StatsCard({
  label,
  value,
  icon,
  variant = "primary",
  className,
  description,
}: StatsCardProps) {
  const getVariantStyles = (v: StatsVariant) => {
    switch (v) {
      case "primary":
        return {
          borderHover: "hover:border-primary",
          iconBox:
            "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
          glow: "group-hover:shadow-primary/20",
        };
      case "secondary":
        return {
          borderHover: "hover:border-secondary",
          iconBox:
            "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white",
          glow: "group-hover:shadow-secondary/20",
        };
      case "success":
        return {
          borderHover: "hover:border-success",
          iconBox:
            "bg-success/10 text-success group-hover:bg-success group-hover:text-white",
          glow: "group-hover:shadow-success/20",
        };
      case "warning":
        return {
          borderHover: "hover:border-warning",
          iconBox:
            "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white",
          glow: "group-hover:shadow-warning/20",
        };
      case "error":
        return {
          borderHover: "hover:border-error",
          iconBox:
            "bg-error/10 text-error group-hover:bg-error group-hover:text-white",
          glow: "group-hover:shadow-error/20",
        };
      case "info":
        return {
          borderHover: "hover:border-info",
          iconBox:
            "bg-info/10 text-info group-hover:bg-info group-hover:text-white",
          glow: "group-hover:shadow-info/20",
        };
      default:
        return {
          borderHover: "hover:border-base-base-content",
          iconBox:
            "bg-base-content/10 text-base-content group-hover:bg-base-content group-hover:text-base-100",
          glow: "group-hover:shadow-base-content/20",
        };
    }
  };

  const styles = getVariantStyles(variant);

  return (
    <div
      className={clsx(
        "group relative flex flex-col items-center overflow-hidden rounded-2xl border-2 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        "border-base-content/5 bg-base-100",
        "dark:border-base-dark-content/5 dark:bg-base-dark",
        styles.borderHover,
        styles.glow,
        className
      )}
    >
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-[0.03] transition-transform duration-500 group-hover:scale-150" />

      <div
        className={clsx(
          "mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
          styles.iconBox
        )}
      >
        <SvgIcon name={icon} className="h-6 w-6" />
      </div>

      <div className="relative z-10 w-full">
        <div className="font-title text-3xl font-bold tracking-tight text-base-content dark:text-base-dark-content">
          {value}
        </div>
        <div className="mt-1 text-xs font-bold uppercase tracking-wider text-base-content/40 dark:text-base-dark-content/40">
          {label}
        </div>
        {description && (
          <div className="mt-2 text-xs text-base-content/60 dark:text-base-dark-content/60">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
