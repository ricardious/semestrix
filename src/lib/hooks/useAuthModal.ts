/**
 * useAuthModal Hook
 *
 * Manages authentication modal state and all auth operations.
 * Centralizes auth logic to keep UI components clean.
 *
 * NOTE: Does NOT handle navigation - PostAuthRedirect component handles that.
 */
import { useState } from "react";
import { neonClient } from "@lib/helpers/neonAuth";

export type AuthView = "main" | "signin" | "signup" | "verify";

export interface UseAuthModalReturn {
  // State
  view: AuthView;
  email: string;
  password: string;
  name: string;
  verificationCode: string;
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;

  // Setters
  setView: (view: AuthView) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  setVerificationCode: (code: string) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;

  // Auth actions
  handleGoogleAuth: () => Promise<void>;
  handleGithubAuth: () => Promise<void>;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  handleVerifyEmail: (e: React.FormEvent) => Promise<void>;
  handleResendCode: () => Promise<void>;
  closeModal: () => void;
}

export function useAuthModal(): UseAuthModalReturn {
  const [view, setView] = useState<AuthView>("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const closeModal = () => {
    const checkbox = document.getElementById("auth-modal") as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
    setView("main");
    setEmail("");
    setPassword("");
    setName("");
    setVerificationCode("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleGoogleAuth = async () => {
    try {
      // Social login - callback will be handled by PostAuthRedirect
      await neonClient.auth.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/",
      });
      closeModal();
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
    }
  };

  const handleGithubAuth = async () => {
    try {
      // Social login - callback will be handled by PostAuthRedirect
      await neonClient.auth.signIn.social({
        provider: "github",
        callbackURL: window.location.origin + "/",
      });
      closeModal();
    } catch (error) {
      console.error("Error en autenticación con GitHub:", error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await neonClient.auth.signIn.email({
        email,
        password,
      });

      // Close modal - PostAuthRedirect will handle navigation
      closeModal();
    } catch (err: any) {
      console.error("Sign in error:", err);
      // Handle various error formats from Neon Auth
      let errorMessage = "Error de autenticación";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.error?.message) {
        // Nested error object: {error: {message: "..."}}
        errorMessage = err.error.message;
      } else if (typeof err?.message === "string") {
        // Standard Error object
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await neonClient.auth.signUp.email({
        email,
        password,
        name: name || email.split("@")[0],
      });

      if (error) throw error;

      if (data?.user && !data.user.emailVerified) {
        setSuccessMessage(
          "Revisa tu email y ingresa el código de verificación"
        );
        setView("verify");
      } else {
        // User created and logged in - PostAuthRedirect will handle navigation
        closeModal();
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      // Handle various error formats from Neon Auth
      let errorMessage = "Error al crear cuenta";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.error?.message) {
        // Nested error object: {error: {message: "..."}}
        errorMessage = err.error.message;
      } else if (typeof err?.message === "string") {
        // Standard Error object
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await neonClient.auth.emailOtp.verifyEmail({
        email,
        otp: verificationCode,
      });

      if (error) throw error;

      setSuccessMessage("¡Email verificado exitosamente!");

      if (data?.user) {
        // User is now verified and logged in - PostAuthRedirect will handle navigation
        closeModal();
      } else {
        setSuccessMessage("Email verificado! Ahora puedes iniciar sesión.");
        setTimeout(() => {
          setView("signin");
          setVerificationCode("");
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      // Handle various error formats from Neon Auth
      let errorMessage = "Código de verificación inválido";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.error?.message) {
        // Nested error object: {error: {message: "..."}}
        errorMessage = err.error.message;
      } else if (typeof err?.message === "string") {
        // Standard Error object
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { error } = await neonClient.auth.sendVerificationEmail({
        email,
        callbackURL: window.location.origin + "/",
      });

      if (error) throw error;

      setSuccessMessage("¡Código reenviado! Revisa tu email.");
    } catch (err: any) {
      console.error("Resend code error:", err);
      // Handle various error formats from Neon Auth
      let errorMessage = "Error al reenviar código";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.error?.message) {
        // Nested error object: {error: {message: "..."}}
        errorMessage = err.error.message;
      } else if (typeof err?.message === "string") {
        // Standard Error object
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    view,
    email,
    password,
    name,
    verificationCode,
    error,
    successMessage,
    isLoading,
    setView,
    setEmail,
    setPassword,
    setName,
    setVerificationCode,
    setError,
    setSuccessMessage,
    handleGoogleAuth,
    handleGithubAuth,
    handleSignIn,
    handleSignUp,
    handleVerifyEmail,
    handleResendCode,
    closeModal,
  };
}
