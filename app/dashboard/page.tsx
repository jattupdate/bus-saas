"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Security Check: Kya user logged in hai?
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/'); // Agar nahi, toh Login page par bhejo
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🚌 BusFlow Admin</h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 text-sm font-bold"
            >
              Logout
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Company Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm font-bold uppercase">Total Buses</p>
                <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <p className="text-gray-500 text-sm font-bold uppercase">Today's Revenue</p>
                <p className="text-3xl font-bold mt-2 text-green-600">₹ 0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                <p className="text-gray-500 text-sm font-bold uppercase">Active Staff</p>
                <p className="text-3xl font-bold mt-2">0</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
                onClick={() => router.push('/dashboard/add-bus')} // <-- YE LINE ADD KAREIN
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition text-left border border-gray-200 group"
            >
                <h3 className="text-lg font-bold text-blue-600 group-hover:text-blue-800">+ Add New Bus</h3>
                <p className="text-gray-400 text-sm mt-1">Register a new vehicle to your fleet</p>
            </button>
            <button className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition text-left border border-gray-200 group">
                <h3 className="text-lg font-bold text-green-600 group-hover:text-green-800">📝 View Waybills</h3>
                <p className="text-gray-400 text-sm mt-1">Audit daily collections and expenses</p>
            </button>
        </div>
      </div>
    </div>
  );
}