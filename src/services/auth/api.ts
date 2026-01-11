import { api } from "../apiClient";
import { User } from "@lib/types/api";

export async function getCurrentUser(): Promise<User> {
  return api.get<User>("/auth/me");
}
