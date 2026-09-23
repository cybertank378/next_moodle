"use client";

import { useState } from "react";

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (input: {
    tenant: string;
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = await response.json();
      if (!response.ok || !body.success) {
        throw new Error(body.error?.message || "Login gagal.");
      }
      return body.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    loading,
    error,
  };
}
