// components/DogCard.tsx
'use client';

import { Dog } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useState } from 'react';
import Image from 'next/image';

interface DogCardProps {
  dog: Dog;
}

export default function DogCard({ dog }: DogCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);

  const handleFavoriteToggle = () => {
    if (isFavorite(dog.id)) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={dog.img}
          alt={dog.name}
          fill
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{dog.name}</h3>
            <p className=" ">{dog.breed}</p>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full ${
              isFavorite(dog.id) ? 'text-red-500' : 'text-gray-400'
            }`}
            aria-label={isFavorite(dog.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={isFavorite(dog.id) ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2">
          <p className="text-sm">Age: {dog.age} years</p>
          <p className="text-sm">Zip Code: {dog.zip_code}</p>
        </div>
      </div>
    </div>
  );
}