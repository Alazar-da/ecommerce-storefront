// components/AppInitializer.tsx
"use client";

import { useEffect } from "react";
import { fetchSession } from "@/utils/fetchSession";
import { useAuthStore } from "@/store/useAuthStore";

export default function AppInitializer() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const sessionUser = await fetchSession();
        if (!mounted) return;
        setUser(sessionUser);
      } catch (err) {
        console.error("fetchSession error:", err);
        setUser(null);
      } finally {
        if (!mounted) return;
        setInitialized(true);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [setUser, setInitialized]);

  return null;
}
