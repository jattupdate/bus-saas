"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Check karna ki banda logged in hai ya nahi
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/'); // Agar login nahi hai, toh wapas bhejo
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

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🚌 BusFlow Admin</h1>
        <div className="flex gap-4">
            <span className="text-gray-600 text-sm mt-2">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
            >
              Logout
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-black">Company Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <p className="text-gray-500">Total Buses</p>
                <p className="text-3xl font-bold text-black">0</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                <p className="text-gray-500">Today's Revenue</p>
                <p className="text-3xl font-bold text-black">₹ 0</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                <p className="text-gray-500">Active Staff</p>
                <p className="text-3xl font-bold text-black">0</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="p-8 bg-white rounded shadow hover:shadow-lg transition text-left border border-gray-200">
                <h3 className="text-lg font-bold text-blue-600">+ Add New Bus</h3>
                <p className="text-gray-400 text-sm">Register a new vehicle to fleet</p>
            </button>
            <button className="p-8 bg-white rounded shadow hover:shadow-lg transition text-left border border-gray-200">
                <h3 className="text-lg font-bold text-green-600">+ View Waybills</h3>
                <p className="text-gray-400 text-sm">Audit daily collections</p>
            </button>
        </div>
      </div>
    </div>
  );
}