'use client'
import React from 'react'
import ProfilePage from '../components/ProfilePage'
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

function Profile() {
  const { user }: { user: any } = useAuthStore();

    if (!user) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-600 mb-6">You must be logged in to view this page.</h1>
                 <Link
          href="/login"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Log In
        </Link>
            </main>
        );
    }
  return (
    <ProfilePage id={user.id} />
  )
}

export default Profile