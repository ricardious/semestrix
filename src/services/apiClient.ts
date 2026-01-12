/**
 * API Client
 *
 * Centralized HTTP client for backend API calls.
 * Handles authentication headers, error handling, and response parsing.
 */
import { neonClient } from "@lib/helpers/neonAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "APIError";
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Get access token from Neon Auth session
 */
async function getAccessToken(): Promise<string | null> {
  // Get the current session from Neon client
  const sessionResult = await neonClient.auth.getSession();
  return sessionResult?.data?.session?.token ?? null;
}

/**
 * Main API client function
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = await getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Handle 401 - Unauthorized
    if (response.status === 401) {
      // Redirect to home and sign out
      console.error("Unauthorized - signing out");
      await neonClient.auth.signOut();
      window.location.href = "/";
      throw new APIError("Unauthorized", 401);
    }

    // Parse response
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle HTTP errors
    if (!response.ok) {
      const message =
        data?.detail || data?.message || `HTTP Error ${response.status}`;
      throw new APIError(message, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

/**
 * Convenience methods
 */
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
