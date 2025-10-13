"use client";

import { useEffect } from "react";
import { fetchSession } from "@/utils/fetchSession";
import { useAuthStore } from "@/store/useAuthStore";

export default function AppInitializer() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const loadUser = async () => {
      const sessionUser = await fetchSession();
      console.log("Fetched session user:", sessionUser);
      setUser(sessionUser); // ✅ sets user if token exists
    };

    loadUser();
  }, [setUser]);

  return null; // nothing renders — it just initializes state
}
