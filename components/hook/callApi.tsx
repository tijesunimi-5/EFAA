"use client";
import { useAlert } from '../context/Alert';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ApiHook {
  callApi: (
    endpoint: string,
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD",
    body?: unknown,
  ) => Promise<unknown>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useAPI = (): ApiHook => {
  const router = useRouter();
  const { showAlert } = useAlert(); // Access the fancy global alert helper

  const callApi = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" = "GET",
      body: unknown = null
    ) => {
      // Ensure endpoint starts with a slash
      const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      // Use the project-specific 'efaa_token' for one-time registration
      const token = typeof window !== "undefined" ? localStorage.getItem("efaa_token") : null;

      const reqHeaders: HeadersInit = {
        "Content-Type": "application/json"
      };

      if (token) {
        reqHeaders['Authorization'] = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers: reqHeaders
      };

      if (body && method !== "GET" && method !== "HEAD") {
        options.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(`${BASE_URL}${finalEndpoint}`, options);

        // Handle automatic token refreshing if the backend sends a new one
        const newToken = response.headers.get('token');
        if (newToken) {
          localStorage.setItem('efaa_token', newToken.replace('Bearer ', ''));
        }

        if (!response.ok) {
          let errorMessage = "An error occurred";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (_e) {
            // Empty catch with underscore to satisfy ESLint
          }

          if (response.status === 401) {
            // Token expired or invalid
            showAlert("Session expired. Redirecting...", "error");
            localStorage.removeItem("efaa_token");
            router.push("/");
          } else {
            // Generic backend error (e.g., location connection failed)
            showAlert(errorMessage, "error");
          }

          return { error: true, status: response.status, message: errorMessage };
        }

        const responseData = await response.json();
        return responseData;

      } catch (_error) {
        // Network connection error (Backend is down or no internet)
        console.error("API call error:", _error);
        showAlert("Network connection error. Check your internet.", "error");
        return { error: true, status: 0, message: "Network connection error" };
      }
    },
    [router, showAlert]
  );

  return { callApi };
};