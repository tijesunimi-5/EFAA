"use client";

import { useAlert } from "../context/Alert";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

// Updated Interface to support Generics
interface ApiResponse {
  error?: boolean;
  success?: boolean; // Added for easier logic checks
  status?: number;
  message?: string;
  token?: string;
  [key: string]: unknown;
}

interface ApiHook {
  // Added <T> to allow passing custom response types
  callApi: <T = ApiResponse>(
    endpoint: string,
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD",
    body?: unknown
  ) => Promise<T & ApiResponse>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const useAPI = (): ApiHook => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const callApi = useCallback(
    async <T = ApiResponse,>(
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" = "GET",
      body: unknown = null
    ): Promise<T & ApiResponse> => {
      if (!BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
      }

      const cleanBase = BASE_URL.replace(/\/+$/, "");
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      const url = `${cleanBase}/${cleanEndpoint}`;
      console.log(`Clean Base ${cleanBase} - Clean Endpoint ${cleanEndpoint} - Url ${url}`)

      const token = typeof window !== "undefined" ? localStorage.getItem("efaa_token") : null;

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

        const newToken = response.headers.get("token");
        if (newToken) {
          localStorage.setItem("efaa_token", newToken.replace("Bearer ", ""));
        }

        const responseData = await response.json();

        // Standardize the success/error property
        const result = {
          ...responseData,
          success: response.ok, // If HTTP 200-299, success is true
          status: response.status,
        };

        if (!response.ok) {
          const errorMessage = result.message || result.error || "An error occurred";

          if (response.status === 401) {
            if (!url.includes("/authentication")) {
              showAlert("Session expired. Please sign in.", "error");
              localStorage.removeItem("efaa_token");
              router.push("/");
            }
          } else {
            showAlert(errorMessage, "error");
          }

          return { ...result, error: true, message: errorMessage } as T & ApiResponse;
        }

        return result as T & ApiResponse;
      } catch (error) {
        console.error("API call error:", error);
        showAlert("Network connection error. Check your server.", "error");
        return {
          error: true,
          success: false,
          status: 0,
          message: "Network connection error",
        } as T & ApiResponse;
      }
    },
    [router, showAlert]
  );

  return { callApi };
};