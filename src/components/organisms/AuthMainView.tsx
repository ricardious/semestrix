/**
 * AuthMainView Organism
 *
 * Main authentication view with OAuth providers and email options
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import AuthProviderButton from "@molecules/AuthProviderButton";
import type { AuthView } from "@lib/hooks/useAuthModal";

interface AuthMainViewProps {
  onGoogleAuth: () => void;
  onSetView: (view: AuthView) => void;
}

export default function AuthMainView({
  onGoogleAuth,
  onSetView,
}: AuthMainViewProps) {
  return (
    <motion.div
      key="main"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 mb-8">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <SvgIcon name="user" size="md" className="text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Accede a todas las funciones de{" "}
            <span className="font-semibold text-primary dark:text-accent">
              Semestrix
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* OAuth Providers */}
        <AuthProviderButton
          provider="google"
          onClick={onGoogleAuth}
          label="Continuar con Google"
        />

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">
            o
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        {/* Email Auth Buttons */}
        <button
          onClick={() => onSetView("signin")}
          className="group w-full h-12 px-6 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center space-x-3">
            <SvgIcon name="mail" size="sm" className="text-white" />
            <span className="font-semibold text-white text-sm">
              Iniciar con Email
            </span>
          </div>
        </button>

        <button
          onClick={() => onSetView("signup")}
          className="group w-full h-12 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-full transition-all duration-300 hover:border-primary dark:hover:border-accent hover:shadow-lg hover:scale-105 active:scale-95 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        >
          <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm transition-colors duration-300 group-hover:text-primary dark:group-hover:text-accent">
            Crear Cuenta
          </span>
        </button>
      </div>

      {/* Legal Text */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
          Al continuar, aceptas los{" "}
          <Link
            to="/legal/terms"
            className="text-primary dark:text-accent hover:underline font-medium"
          >
            Términos de Uso
          </Link>{" "}
          y confirmas que has leído las{" "}
          <Link
            to="/legal/privacy"
            className="text-primary dark:text-accent hover:underline font-medium"
          >
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
}
