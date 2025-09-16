import { Link, useNavigate } from "react-router-dom";
import SvgIcon from "@atoms/SvgIcon";
import GradientBackdrop from "@atoms/GradientBackdrop";
import { useGoogleLogin, useGithubLogin } from "@/services/auth/queries";

const AuthModal: React.FC = () => {
  const googleLogin = useGoogleLogin();
  const githubLogin = useGithubLogin();
  const navigate = useNavigate();

  // Handle Google and GitHub authentication
  const handleGoogleAuth = async () => {
    try {
      await googleLogin.mutateAsync();
      const checkbox = document.getElementById(
        "auth-modal"
      ) as HTMLInputElement;
      if (checkbox) checkbox.checked = false;
      navigate("/onboarding");
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
    }
  };

  const handleGithubAuth = async () => {
    try {
      await githubLogin.mutateAsync();
      const checkbox = document.getElementById(
        "auth-modal"
      ) as HTMLInputElement;
      if (checkbox) checkbox.checked = false;
    } catch (error) {
      console.error("Error en autenticación con GitHub:", error);
    }
  };

  return (
    <>
      {/* Hidden Checkbox to Control Modal */}
      <input type="checkbox" id="auth-modal" className="hidden peer" />

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 dark:bg-black/50 invisible opacity-0 peer-checked:visible peer-checked:opacity-100 transition-all duration-300">
        <div className="relative container mx-auto px-6 max-w-md">
          <div className="relative bg-white/90 dark:bg-base-dark/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <GradientBackdrop />

            {/* Close Button */}
            <label
              htmlFor="auth-modal"
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <SvgIcon
                name="x"
                size="sm"
                className="text-gray-500 dark:text-gray-400"
              />
            </label>

            <div className="p-8 relative z-[1]">
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
                {/* Google Auth Button */}
                <button
                  onClick={handleGoogleAuth}
                  className="group w-full h-12 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-full transition-all duration-300 hover:border-primary dark:hover:border-accent hover:shadow-lg hover:scale-105 active:scale-95 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="w-5 h-5"
                      alt="Google logo"
                    />
                    <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm transition-colors duration-300 group-hover:text-primary dark:group-hover:text-accent">
                      Continuar con Google
                    </span>
                  </div>
                </button>

                {/* GitHub Auth Button */}
                <button
                  onClick={handleGithubAuth}
                  className="group w-full h-12 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-full transition-all duration-300 hover:border-primary dark:hover:border-accent hover:shadow-lg hover:scale-105 active:scale-95 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="w-5 h-5 text-gray-700 dark:text-gray-200"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm transition-colors duration-300 group-hover:text-primary dark:group-hover:text-accent">
                      Continuar con GitHub
                    </span>
                  </div>
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
            </div>
          </div>
        </div>

        {/* Close modal when clicking outside */}
        <label
          htmlFor="auth-modal"
          className="absolute inset-0 cursor-pointer -z-10"
        ></label>
      </div>
    </>
  );
};

export default AuthModal;
