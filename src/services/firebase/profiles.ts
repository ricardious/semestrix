import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@lib/firebase/config";

export interface UserProfile {
  uid: string;
  career_id: string;
  career_name: string;
  start_year: number;
  completed_courses: string[];
  onboarding_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export const saveUserProfile = async (
  profile: Omit<UserProfile, "created_at" | "updated_at">
): Promise<void> => {
  const now = new Date();
  const profileData = {
    ...profile,
    created_at: now,
    updated_at: now,
  };

  await setDoc(doc(db, "userProfiles", profile.uid), profileData);
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "userProfiles", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }

  return null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  const docRef = doc(db, "userProfiles", uid);
  await updateDoc(docRef, {
    ...updates,
    updated_at: new Date(),
  });
};
