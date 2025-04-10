// components/FavoritesPanel.tsx
'use client';

import { useState } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import Image from 'next/image';
import { getMatch } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function FavoritesPanel() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const router = useRouter();

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) return;
    
    try {
      setIsGeneratingMatch(true);
      const dogIds = favorites.map(dog => dog.id);
      const result = await getMatch(dogIds);
      
      if (result.match) {
        // Store the match result and favorite dogs in localStorage for the match page
        localStorage.setItem('matchResult', JSON.stringify({
          matchId: result.match,
          favorites: favorites
        }));
        
        // Navigate to the match page
        router.push('/match');
      }
    } catch (error) {
      console.error('Error generating match:', error);
      alert('Failed to generate a match. Please try again.');
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  return (
    <>
      {/* Favorites button with count badge */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg z-10 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {favorites.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {favorites.length}
          </span>
        )}
      </button>

      {/* Favorites panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">Your Favorites</h2>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="">You haven&#39;t added any dogs to your favorites yet.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {favorites.map(dog => (
                      <div key={dog.id} className="flex items-center border rounded-lg overflow-hidden">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={dog.img}
                            alt={dog.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow p-3">
                          <h3 className="font-semibold">{dog.name}</h3>
                          <p className="text-sm  ">{dog.breed}</p>
                        </div>
                        <button
                          onClick={() => removeFavorite(dog.id)}
                          className="p-3 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleGenerateMatch}
                      disabled={isGeneratingMatch || favorites.length === 0}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isGeneratingMatch ? 'Generating Match...' : 'Find My Match'}
                    </button>
                    
                    <button
                      onClick={clearFavorites}
                      className="w-full bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      Clear All
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}