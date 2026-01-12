import SvgIcon from "@atoms/SvgIcon";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  size = "md",
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={`transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <SvgIcon
        name={isDark ? "sun" : "moon"}
        size={size}
        className="text-current transition-transform duration-300"
      />
    </button>
  );
};

export default ThemeToggle;
