'use client';
import './globals.css'
import AppInitializer from "./components/AppInitializer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
