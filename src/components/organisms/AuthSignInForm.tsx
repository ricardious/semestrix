/**
 * AuthSignInForm Organism
 *
 * Sign in form with email and password
 */
import { motion } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import AuthFormField from "@molecules/AuthFormField";
import AuthMessage from "@molecules/AuthMessage";
import type { AuthView } from "@lib/hooks/useAuthModal";

interface AuthSignInFormProps {
  email: string;
  password: string;
  error: string | null;
  isLoading: boolean;
  onSetEmail: (email: string) => void;
  onSetPassword: (password: string) => void;
  onSetView: (view: AuthView) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthSignInForm({
  email,
  password,
  error,
  isLoading,
  onSetEmail,
  onSetPassword,
  onSetView,
  onSubmit,
}: AuthSignInFormProps) {
  return (
    <motion.div
      key="signin"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 mb-8">
        {/* Back Button */}
        <button
          onClick={() => onSetView("main")}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors"
        >
          <SvgIcon name="chevron-left" size="sm" />
          <span className="text-sm font-medium">Volver</span>
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Ingresa tus credenciales
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <AuthMessage type="error" message={error} />}

        <AuthFormField
          label="Email"
          type="email"
          value={email}
          onChange={onSetEmail}
          placeholder="tu@email.com"
          required
        />

        <AuthFormField
          label="Contraseña"
          type="password"
          value={password}
          onChange={onSetPassword}
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 px-6 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="font-semibold text-white text-sm">
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => onSetView("signup")}
            className="text-primary dark:text-accent font-medium hover:underline"
          >
            Créala aquí
          </button>
        </p>
      </form>
    </motion.div>
  );
}
