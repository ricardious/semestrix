import { clsx } from "clsx";
import SvgIcon from "@atoms/SvgIcon";

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  variant?: "primary" | "dashed";
  className?: string;
}

export default function ActionCard({
  title,
  description,
  icon,
  onClick,
  variant = "primary",
  className,
}: ActionCardProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative w-full overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300",
        // Primary Variant Styles
        isPrimary && [
          "border-base-content/5 bg-base-100 shadow-sm",
          "hover:border-primary hover:shadow-xl hover:shadow-primary/10",
          "dark:bg-base-dark dark:border-base-dark-content/10 dark:hover:border-primary",
        ],
        // Dashed Variant Styles
        !isPrimary && [
          "border-dashed border-base-content/20 bg-transparent",
          "hover:border-base-content/40 hover:bg-base-content/5",
          "dark:border-base-dark-content/20 dark:hover:border-base-dark-content/40 dark:hover:bg-base-dark-content/5",
        ],
        className
      )}
    >
      {/* Background Effect for Primary */}
      {isPrimary && (
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-2rem] rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />
      )}

      <div className="relative flex items-center gap-5">
        <div
          className={clsx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
            // Icon Container Primary
            isPrimary && [
              "bg-primary/10 text-primary",
              "group-hover:bg-primary group-hover:text-white",
            ],
            // Icon Container Dashed
            !isPrimary && [
              "bg-base-content/5 text-base-content/60",
              "group-hover:bg-base-content/10 group-hover:text-base-content",
              "dark:bg-base-dark-content/5 dark:text-base-dark-content/60",
              "dark:group-hover:bg-base-dark-content/10 dark:group-hover:text-base-dark-content",
            ]
          )}
        >
          <SvgIcon name={icon} className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-title text-lg font-bold text-base-content dark:text-base-dark-content">
            {title}
          </h3>
          <p
            className={clsx(
              "mt-1 text-sm leading-relaxed",
              "text-base-content/60 dark:text-base-dark-content/60",
              isPrimary &&
                "group-hover:text-base-content/80 dark:group-hover:text-base-dark-content/80"
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
