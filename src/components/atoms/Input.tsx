import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useRef,
  useImperativeHandle,
} from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import SvgIcon from "@atoms/SvgIcon";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string | boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, leftIcon, rightIcon, error, fullWidth = true, type, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const handleStep = (direction: "up" | "down") => {
      if (!internalRef.current) return;

      try {
        if (direction === "up") internalRef.current.stepUp();
        else internalRef.current.stepDown();

        // Trigger React change event
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(
            internalRef.current,
            internalRef.current.value
          );
        }

        const event = new Event("input", { bubbles: true });
        internalRef.current.dispatchEvent(event);
      } catch (e) {
        console.warn("Input step failed", e);
      }
    };

    return (
      <div className={clsx("relative", fullWidth && "w-full")}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={internalRef}
          type={type}
          className={twMerge(
            // Base styles
            "block w-full rounded-lg border-2 bg-base-100/50 px-4 py-3 text-base-content transition-all duration-200 outline-none",
            "placeholder:text-base-content/40 dark:placeholder:text-base-dark-content/40",

            // Default border & focus states (unless error)
            !error &&
              "border-base-content/50 hover:border-primary/70 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20",

            // Error states
            error &&
              "border-error bg-error/5 focus:border-error focus:ring-2 focus:ring-error/20",

            // Dark mode default
            "dark:bg-base-dark/60 dark:text-base-dark-content dark:focus:bg-base-dark/80 dark:border-primary/50 dark:hover:border-primary",

            // Disabled state
            props.disabled && "opacity-50 cursor-not-allowed",

            // Padding adjustments
            leftIcon && "pl-10",
            (rightIcon || type === "number") && "pr-12", // Increased padding for number controls

            className
          )}
          {...props}
        />

        {type === "number" && !props.disabled && (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <button
              type="button"
              onClick={() => handleStep("down")}
              className="flex h-6 w-6 items-center justify-center rounded-full text-base-content/70 hover:bg-base-content/10 hover:text-primary active:scale-95 transition-all dark:text-base-dark-content/70 dark:hover:bg-base-dark-content/10"
              tabIndex={-1}
            >
              <SvgIcon name="subtract" className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => handleStep("up")}
              className="flex h-6 w-6 items-center justify-center rounded-full text-base-content/70 hover:bg-base-content/10 hover:text-primary active:scale-95 transition-all dark:text-base-dark-content/70 dark:hover:bg-base-dark-content/10"
              tabIndex={-1}
            >
              <SvgIcon name="add" className="h-3 w-3" />
            </button>
          </div>
        )}

        {rightIcon && type !== "number" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
