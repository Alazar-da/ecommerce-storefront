// app/layout.tsx
"use client";
import "./globals.css";
import AppInitializer from "./components/AppInitializer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Head from 'next/head';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // only run guard logic for admin routes
    if (!pathname?.startsWith?.("/admin")) return;

    // Wait until session init completes to avoid false positives (flicker)
    if (!initialized) return;

    // Not logged in
    if (!user) {
      toast.info("Please log in as an admin to access that page.");
      // ensure store cleared
      logout();
      // redirect to login
      router.replace("/login");
      return;
    }

    // Logged in but not admin
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admins only.");
      // Optional: clear store or keep user as-is.
      // logout(); // optional, don't logout normal user
      router.replace("/");
      return;
    }

    // user is admin => do nothing (allow access)
  }, [pathname, user, initialized, router, logout]);

  return (
    <html lang="en">
      <body>
        <AppInitializer />
        {children}
        <ToastContainer autoClose={3000} />
      </body>
    </html>
  );
}
