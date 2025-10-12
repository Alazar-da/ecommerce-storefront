'use client'
import React from 'react'
import ProfilePage from '../components/ProfilePage'
import { useSession } from '@/utils/useSession';

function Profile() {
  const { user }: { user: any } = useSession();

    if (!user) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">You must be logged in to view this page.</h1>
            </main>
        );
    }
  return (
    <ProfilePage id={user.id} />
  )
}

export default Profile