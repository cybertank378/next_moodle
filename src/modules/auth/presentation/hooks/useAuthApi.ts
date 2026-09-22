"use client";

import { useState } from "react";

export function useAuthApi() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      // Sesi logout ditangani pada endpoint auth di Issue berikutnya
      await new Promise((resolve) => setTimeout(resolve, 200));
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
  };
}
