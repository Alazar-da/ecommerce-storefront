// app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeftCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-white text-center px-6">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-8xl font-extrabold text-emerald-600 mb-2"
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4"
      >
        Page Not Found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 mb-8 max-w-md"
      >
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md"
        >
          <FiHome className="text-lg" />
          Go Home
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 border border-cyan-500 text-cyan-600 px-5 py-2 rounded-xl hover:bg-cyan-100 hover:text-slate-600 transition-all duration-200 hover:cursor-pointer"
        >
          <FiArrowLeftCircle className="text-lg" />
          Go Back
        </button>
      </div>
    </main>
  );
}
