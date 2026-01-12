import { motion } from "framer-motion";
import { textReveal } from "@lib/helpers/motion";
import { cn } from "@lib/helpers/cn";

interface AnimatedTextProps {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  text: string;
  delay: number;
  variant?: "title" | "description";
  className?: string;
}

const AnimatedText = ({
  tag,
  text,
  delay,
  variant,
  className,
}: AnimatedTextProps) => {
  const MotionComponent = motion[tag];

  const baseClasses = {
    title: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6",
    description:
      "text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed",
  };

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={textReveal(delay)}
      className={cn(variant ? baseClasses[variant] : "", className)}
    >
      {text}
    </MotionComponent>
  );
};

export default AnimatedText;
