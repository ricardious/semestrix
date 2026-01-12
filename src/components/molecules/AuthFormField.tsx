/**
 * AuthFormField Molecule
 *
 * Reusable form input field for auth forms
 */

interface AuthFormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  autoFocus?: boolean;
}

export default function AuthFormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  className = "",
  autoFocus = false,
}: AuthFormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
