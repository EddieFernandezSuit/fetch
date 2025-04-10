// components/Header.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-md text-black ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Fetch Dog Adoption</h1>
          </div>
          
          {user && (
            <div className="flex items-center">
              <span className="mr-4  ">
                Hello, {user.name}
              </span>
              <button
                onClick={logout}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}