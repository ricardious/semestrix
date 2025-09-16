interface StepBadgeProps {
  stepNumber: number;
  variant?: "primary" | "blue" | "purple" | "green";
  size?: "sm" | "md" | "lg";
}

const StepBadge: React.FC<StepBadgeProps> = ({
  stepNumber,
  variant = "primary",
  size = "md",
}) => {
  const variants = {
    primary: {
      gradient: "from-primary to-secondary",
      shadow: "group-hover:shadow-primary/30",
    },
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      shadow: "group-hover:shadow-blue-500/30",
    },
    purple: {
      gradient: "from-purple-500 to-violet-600",
      shadow: "group-hover:shadow-purple-500/30",
    },
    green: {
      gradient: "from-green-500 to-emerald-600",
      shadow: "group-hover:shadow-green-500/30",
    },
  };

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`
        absolute -top-4 -right-4 
        ${sizes[size]} 
        bg-gradient-to-br ${currentVariant.gradient} 
        rounded-full 
        flex items-center justify-center 
        text-white font-bold 
        shadow-lg ${currentVariant.shadow}
        group-hover:scale-110 
        transition-all duration-300
        border-2 border-white/20
        backdrop-blur-sm
      `}
    >
      {stepNumber}
    </div>
  );
};

export default StepBadge;
