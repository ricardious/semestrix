import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { RouterProvider } from "react-router-dom";
import "@styles/globals.css";
import { router } from "@routes/routes";
import { ThemeProvider } from "@context/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for persistence
    },
  },
});

// Setup persistence with localStorage
persistQueryClient({
  queryClient,
  persister: {
    persistClient: (client) => {
      localStorage.setItem("semestrix-query-cache", JSON.stringify(client));
    },
    restoreClient: () => {
      const cached = localStorage.getItem("semestrix-query-cache");
      return cached ? JSON.parse(cached) : undefined;
    },
    removeClient: () => {
      localStorage.removeItem("semestrix-query-cache");
    },
  },
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
