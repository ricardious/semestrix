/**
 * AuthMessage Molecule
 *
 * Displays success or error messages in auth forms
 */
import SvgIcon from "@atoms/SvgIcon";

interface AuthMessageProps {
  type: "error" | "success";
  message: string;
  icon?: string;
}

export default function AuthMessage({ type, message, icon }: AuthMessageProps) {
  const isError = type === "error";

  // Safeguard: ensure message is always a string
  const displayMessage =
    typeof message === "string" ? message : JSON.stringify(message);

  const bgColor = isError
    ? "bg-red-100 dark:bg-red-900/30"
    : "bg-green-100 dark:bg-green-900/30";

  const borderColor = isError
    ? "border-red-300 dark:border-red-700"
    : "border-green-300 dark:border-green-700";

  const textColor = isError
    ? "text-red-700 dark:text-red-300"
    : "text-green-700 dark:text-green-300";

  return (
    <div className={`p-3 ${bgColor} border ${borderColor} rounded-lg`}>
      {icon ? (
        <div className="flex items-start space-x-2">
          <SvgIcon name={icon} size="sm" className={`${textColor} mt-0.5`} />
          <p className={`text-sm ${textColor}`}>{displayMessage}</p>
        </div>
      ) : (
        <p className={`text-sm ${textColor}`}>{displayMessage}</p>
      )}
    </div>
  );
}
