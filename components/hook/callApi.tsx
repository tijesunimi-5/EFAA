"use client";

import { useAlert } from "../context/Alert";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

// Defining a more specific interface for the API response
interface ApiResponse {
  error?: boolean;
  status?: number;
  message?: string;
  token?: string;
  [key: string]: unknown;
}

interface ApiHook {
  callApi: (
    endpoint: string,
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD",
    body?: unknown
  ) => Promise<ApiResponse>;
}

// Only use NEXT_PUBLIC_ variables in Next.js frontend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const useAPI = (): ApiHook => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const callApi = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" = "GET",
      body: unknown = null
    ): Promise<ApiResponse> => {
      if (!BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
      }

      // Clean URL joining (prevents double or missing slashes)
      const cleanBase = BASE_URL.replace(/\/+$/, "");
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      const url = `${cleanBase}/${cleanEndpoint}`;

      console.log(`Base-URL ${BASE_URL} - Clean Base ${cleanBase} - Clean Endpoint ${cleanEndpoint} - URL ${url}`)
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("efaa_token")
          : null;

      const reqHeaders: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        reqHeaders["Authorization"] = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers: reqHeaders,
      };

      if (body && method !== "GET" && method !== "HEAD") {
        options.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(url, options);
        console.log(`API Request: ${url} - Method: ${method}`);

        // Update token if backend rotates it
        const newToken = response.headers.get("token");
        if (newToken) {
          localStorage.setItem(
            "efaa_token",
            newToken.replace("Bearer ", "")
          );
        }

        const responseData = await response.json();

        if (!response.ok) {
          const errorMessage =
            responseData.message ||
            responseData.error ||
            "An error occurred";

          if (response.status === 401) {
            if (!url.includes("/authentication")) {
              showAlert("Session expired. Please sign in.", "error");
              localStorage.removeItem("efaa_token");
              router.push("/");
            }
          } else {
            showAlert(errorMessage, "error");
          }

          return {
            error: true,
            status: response.status,
            message: errorMessage,
            ...responseData,
          };
        }

        return responseData;
      } catch (error) {
        console.error("API call error:", error);
        showAlert(
          "Network connection error. Check your server.",
          "error"
        );
        return {
          error: true,
          status: 0,
          message: "Network connection error",
        };
      }
    },
    [router, showAlert]
  );

  return { callApi };
};