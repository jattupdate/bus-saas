"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AddBus() {
  const router = useRouter();
  const [busNumber, setBusNumber] = useState('');
  const [route, setRoute] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddBus = async () => {
    if (!busNumber || !route) {
      setMessage('❌ Please fill all fields');
      return;
    }
    setLoading(true);

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. CHECK: Kya User ka Profile/Company bana hua hai?
    let { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    // 3. MAGIC FIX: Agar Profile nahi hai (First Time User), toh Company banao
    if (!profile) {
      // Create Company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({ name: 'My Transport Company' })
        .select()
        .single();
      
      if (companyError) {
        setMessage('Error creating company: ' + companyError.message);
        setLoading(false);
        return;
      }

      // Create Profile linked to Company
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
            id: user.id, 
            role: 'owner', 
            company_id: company.id 
        });

      if (profileError) {
        setMessage('Error creating profile: ' + profileError.message);
        setLoading(false);
        return;
      }
      
      // Set the new profile ID for use below
      profile = { company_id: company.id };
    }

    // 4. Ab Bus Add karein
    const { error } = await supabase
      .from('buses')
      .insert({
        company_id: profile.company_id,
        number_plate: busNumber,
        route_name: route
      });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('✅ Bus Added Successfully!');
      setTimeout(() => router.push('/dashboard'), 1500); // 1.5 sec baad Dashboard par wapas
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Add New Bus</h2>

        {message && <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4 text-sm">{message}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Bus Number Plate</label>
            <input 
              type="text" 
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50 uppercase"
              placeholder="PB-08-CX-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Route Name</label>
            <input 
              type="text" 
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              placeholder="Delhi - Chandigarh"
            />
          </div>

          <button 
            onClick={handleAddBus}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : 'Save Bus'}
          </button>

          <button 
            onClick={() => router.back()}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}