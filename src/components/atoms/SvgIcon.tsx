import { SVGProps } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Props for the SvgIcon component
 */
interface SvgIconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** The icon identifier to use from the sprite sheet */
  name: string;
  /** The base path for the sprite sheet (defaults to '/icons/sprite.svg') */
  spritePath?: string;
  /** Size preset for common icon sizes */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
} as const;

/**
 * A component that renders an SVG icon from a sprite sheet.
 *
 * @param props - The component props
 * @returns An SVG icon component
 *
 * @example
 * // Basic usage
 * <SvgIcon name="home" />

 * @example
 * // With size preset
 * <SvgIcon name="user" size="lg" />
 *
 * @example
 * // With custom classes and styles
 * <SvgIcon name="search" className="text-blue-500" style={{ color: 'blue' }} />
 *
 * @example
 * // With custom sprite path
 * <SvgIcon name="arrow" spritePath="/assets/icons.svg" />
 */
const SvgIcon = ({
  name,
  className,
  size = "md",
  spritePath = "/icons/sprite.svg",
  "aria-hidden": ariaHidden = true,
  ...props
}: SvgIconProps) => {
  const sizeClass = sizeClasses[size];
  const finalClassName = twMerge(sizeClass, className);

  return (
    <svg className={finalClassName} aria-hidden={ariaHidden} {...props}>
      <use href={`${spritePath}#${name}`} />
    </svg>
  );
};

export default SvgIcon;
