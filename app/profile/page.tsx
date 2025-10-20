'use client'
import React from 'react'
import ProfilePage from '../components/ProfilePage'
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

function Profile() {
  const { user }: { user: any } = useAuthStore();

      if (!user)
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <Link
            href="/login"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Log In
          </Link>
        </div>
      );
  return (
    <ProfilePage id={user.id} />
  )
}

export default Profile