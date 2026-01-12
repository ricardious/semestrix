interface StepConnectorProps {
  variant?: "blue" | "primary" | "purple" | "green";
  lineHeight?: "sm" | "md" | "lg";
}

const StepConnector: React.FC<StepConnectorProps> = ({
  variant = "blue",
  lineHeight = "md",
}) => {
  const variants = {
    blue: {
      line: "from-blue-400/60 to-blue-500/40 group-hover/step:from-blue-500 group-hover/step:to-indigo-500",
      dot: "from-blue-500 to-indigo-500",
      glow: "from-blue-400 to-indigo-400",
      shadow: "group-hover/step:shadow-blue-500/50",
    },
    primary: {
      line: "from-primary/60 to-primary/40 group-hover/step:from-primary group-hover/step:to-secondary",
      dot: "from-primary to-secondary",
      glow: "from-primary to-secondary",
      shadow: "group-hover/step:shadow-primary/50",
    },
    purple: {
      line: "from-purple-400/60 to-purple-500/40 group-hover/step:from-purple-500 group-hover/step:to-violet-500",
      dot: "from-purple-500 to-violet-500",
      glow: "from-purple-400 to-violet-400",
      shadow: "group-hover/step:shadow-purple-500/50",
    },
    green: {
      line: "from-green-400/60 to-green-500/40 group-hover/step:from-green-500 group-hover/step:to-emerald-500",
      dot: "from-green-500 to-emerald-500",
      glow: "from-green-400 to-emerald-400",
      shadow: "group-hover/step:shadow-green-500/50",
    },
  };

  const lineHeightClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  const currentVariant = variants[variant];

  return (
    <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-1 group-hover/step:scale-110 transition-transform duration-300">
      {/* Line */}
      <div
        className={`
          w-0.5 ${lineHeightClasses[lineHeight]} 
          bg-gradient-to-b ${currentVariant.line} 
          rounded-full shadow-sm mx-auto 
          group-hover/step:shadow-lg 
          transition-all duration-500
        `}
      />

      {/* Dot container */}
      <div className="flex justify-center my-3">
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className={`
              absolute inset-0 w-4 h-4 
              bg-gradient-to-br ${currentVariant.glow} 
              rounded-full animate-ping opacity-30 
              group-hover/step:opacity-60 
              group-hover/step:w-6 group-hover/step:h-6 
              group-hover/step:-top-1 group-hover/step:-left-1 
              transition-all duration-300
            `}
          />

          {/* Main dot */}
          <div
            className={`
              relative w-4 h-4 
              bg-gradient-to-br ${currentVariant.dot} 
              rounded-full shadow-lg border-2 border-white/30 
              animate-pulse 
              group-hover/step:w-5 group-hover/step:h-5 
              group-hover/step:shadow-2xl ${currentVariant.shadow} 
              group-hover/step:border-white/60 
              transition-all duration-300
            `}
          >
            {/* Inner shine */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/20 rounded-full group-hover/step:bg-white/60 group-hover/step:w-2 group-hover/step:h-2 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepConnector;
