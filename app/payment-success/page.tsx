"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0.00";
  const { user }: { user: any } = useAuthStore();

   if (!user)
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to see this page.</p>
          <Link
            href="/login"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Log In
          </Link>
        </div>
      );

  return (
    <section className="min-h-screen relative bg-gray-50 flex flex-col items-center justify-center w-full">
      {/* Breadcrumb Navigation */}
      <nav className="flex absolute top-5 left-15 z-10" aria-label="Breadcrumb">
        <ol className="flex space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <Link href="/orders" className="text-gray-500 hover:text-gray-700">
              Orders
            </Link>
          </li>
        </ol>
      </nav>

      {/* Main Success Card */}
      <section className="max-w-6xl mx-auto p-10 text-white text-center border rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
          <h2 className="text-2xl">You successfully sent</h2>
          <div className="bg-white p-2 rounded-md text-emerald-500 mt-5 text-4xl font-bold">
            ${amount}
          </div>
        </div>
      </section>
    </section>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
