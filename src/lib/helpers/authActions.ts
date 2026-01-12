import { neonClient } from "./neonAuth";

export async function signOut() {
  await neonClient.auth.signOut();
  // Clear local query cache is handled by redirect usually, but we might want to force reload
  window.location.href = "/";
}
