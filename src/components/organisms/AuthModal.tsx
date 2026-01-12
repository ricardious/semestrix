/**
 * AuthModal Organism (Orchestrator)
 *
 * Main authentication modal that orchestrates all auth views.
 * Manages state and navigation between different auth flows.
 *
 * NOTE: Navigation after auth is handled by PostAuthRedirect component.
 */
import { AnimatePresence } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import GradientBackdrop from "@atoms/GradientBackdrop";
import AuthMainView from "@organisms/AuthMainView";
import AuthSignInForm from "@organisms/AuthSignInForm";
import AuthSignUpForm from "@organisms/AuthSignUpForm";
import AuthVerifyForm from "@organisms/AuthVerifyForm";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";
import { useAuthModal } from "@lib/hooks/useAuthModal";

const AuthModal: React.FC = () => {
  const { user, signOut } = useNeonAuth();
  const auth = useAuthModal();

  // If user is logged in, show dashboard option
  if (user) {
    return (
      <>
        <input type="checkbox" id="auth-modal" className="hidden peer" />

        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 dark:bg-black/50 invisible opacity-0 peer-checked:visible peer-checked:opacity-100 transition-all duration-300"
          onClick={auth.closeModal}
        >
          <div className="relative container mx-auto px-6 max-w-md">
            <div
              className="relative bg-white/90 dark:bg-base-dark/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <GradientBackdrop />

              <button
                onClick={auth.closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <SvgIcon
                  name="x"
                  size="sm"
                  className="text-gray-500 dark:text-gray-400"
                />
              </button>

              <div className="p-8 relative z-[1]">
                <div className="space-y-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <SvgIcon name="user" size="md" className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Hola de nuevo!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {user.name || user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={async () => {
                      await signOut();
                      auth.closeModal();
                    }}
                    className="group w-full h-12 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-full transition-all duration-300 hover:border-red-500 dark:hover:border-red-500 hover:shadow-lg hover:scale-105 active:scale-95 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm transition-colors duration-300 group-hover:text-red-500">
                      Cerrar Sesión
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Unauthenticated user - show auth forms
  return (
    <>
      <input type="checkbox" id="auth-modal" className="hidden peer" />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 dark:bg-black/50 invisible opacity-0 peer-checked:visible peer-checked:opacity-100 transition-all duration-300"
        onClick={auth.closeModal}
      >
        <div className="relative container mx-auto px-6 max-w-md">
          <div
            className="relative bg-white/90 dark:bg-base-dark/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <GradientBackdrop />

            <button
              onClick={auth.closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              aria-label="Cerrar modal"
            >
              <SvgIcon
                name="x"
                size="sm"
                className="text-gray-500 dark:text-gray-400"
              />
            </button>

            <div className="p-8 relative z-[1]">
              <AnimatePresence mode="wait">
                {auth.view === "main" && (
                  <AuthMainView
                    onGoogleAuth={auth.handleGoogleAuth}
                    onSetView={auth.setView}
                  />
                )}

                {auth.view === "signin" && (
                  <AuthSignInForm
                    email={auth.email}
                    password={auth.password}
                    error={auth.error}
                    isLoading={auth.isLoading}
                    onSetEmail={auth.setEmail}
                    onSetPassword={auth.setPassword}
                    onSetView={auth.setView}
                    onSubmit={auth.handleSignIn}
                  />
                )}

                {auth.view === "signup" && (
                  <AuthSignUpForm
                    name={auth.name}
                    email={auth.email}
                    password={auth.password}
                    error={auth.error}
                    successMessage={auth.successMessage}
                    isLoading={auth.isLoading}
                    onSetName={auth.setName}
                    onSetEmail={auth.setEmail}
                    onSetPassword={auth.setPassword}
                    onSetView={auth.setView}
                    onSubmit={auth.handleSignUp}
                  />
                )}

                {auth.view === "verify" && (
                  <AuthVerifyForm
                    email={auth.email}
                    verificationCode={auth.verificationCode}
                    error={auth.error}
                    successMessage={auth.successMessage}
                    isLoading={auth.isLoading}
                    onSetCode={auth.setVerificationCode}
                    onSetView={auth.setView}
                    onSubmit={auth.handleVerifyEmail}
                    onResend={auth.handleResendCode}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
