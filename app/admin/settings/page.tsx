'use client'
import { useState } from 'react'
import ProfilePage from '../../components/ProfilePage'
import Sidebar from '../components/sidebar';
import { useAuthStore } from '@/store/useAuthStore';

function Setting() {
  const { user }: { user: any } = useAuthStore();
     const [activePage, setActivePage] = useState('settings');

    if (!user) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-slate-800">
                <h1 className="text-2xl font-bold">You must be logged in to view this page.</h1>  
            </main>
        );
    }
  return (
       <main className="flex h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 w-full text-slate-800">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <section className='w-full flex items-center justify-center h-screen py-5'>
    <ProfilePage id={user.id} />
                </section>

    </main>
  )
}

export default Setting