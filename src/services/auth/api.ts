import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
} from "@lib/firebase/config";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
}

export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: "google",
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithGithub = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: "github",
    };
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId || "unknown",
      };
      callback(authUser);
    } else {
      callback(null);
    }
  });
};
