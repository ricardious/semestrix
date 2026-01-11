/**
 * AuthVerifyForm Organism
 *
 * Email verification form with OTP code input
 */
import { motion } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import AuthMessage from "@molecules/AuthMessage";
import type { AuthView } from "@lib/hooks/useAuthModal";

interface AuthVerifyFormProps {
  email: string;
  verificationCode: string;
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;
  onSetCode: (code: string) => void;
  onSetView: (view: AuthView) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
}

export default function AuthVerifyForm({
  email,
  verificationCode,
  error,
  successMessage,
  isLoading,
  onSetCode,
  onSetView,
  onSubmit,
  onResend,
}: AuthVerifyFormProps) {
  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 mb-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
          <SvgIcon name="mail" size="lg" className="text-white" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifica tu Email
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Hemos enviado un código de verificación a
          </p>
          <p className="text-primary dark:text-accent font-medium text-sm mt-1">
            {email}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {successMessage && (
          <AuthMessage type="success" message={successMessage} />
        )}

        {error && <AuthMessage type="error" message={error} />}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
            Código de Verificación
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              // Only allow digits for OTP
              const cleaned = e.target.value.replace(/[^0-9]/g, "");
              onSetCode(cleaned);
            }}
            required
            maxLength={6}
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all text-center text-2xl tracking-widest font-mono"
            placeholder="123456"
            autoFocus
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Ingresa el código de 6 dígitos
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full h-12 px-6 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="font-semibold text-white text-sm">
            {isLoading ? "Verificando..." : "Verificar Email"}
          </span>
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿No recibiste el código?
          </p>
          <button
            type="button"
            onClick={onResend}
            disabled={isLoading}
            className="text-primary dark:text-accent font-medium hover:underline text-sm disabled:opacity-50"
          >
            Reenviar código
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSetView("signup")}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors text-sm"
        >
          <SvgIcon name="chevron-left" size="sm" />
          <span>Volver al registro</span>
        </button>
      </form>
    </motion.div>
  );
}
