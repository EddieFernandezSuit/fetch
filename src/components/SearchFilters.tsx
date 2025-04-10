// components/SearchFilters.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { getBreeds } from '@/services/api';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    breeds: string[];
    ageMin?: number;
    ageMax?: number;
    sort: string;
  }) => void;
  currentSort: string;
}

export default function SearchFilters({ onFiltersChange, currentSort }: SearchFiltersProps) {
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    currentSort === 'breed:desc' ? 'desc' : 'asc'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setIsLoading(true);
        const breeds = await getBreeds();
        setAllBreeds(breeds);
      } catch (err) {
        console.error('Failed to fetch breeds:', err);
        setError('Failed to load dog breeds. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const filters = {
      breeds: selectedBreeds,
      ageMin: ageMin ? Number(ageMin) : undefined,
      ageMax: ageMax ? Number(ageMax) : undefined,
      sort: `breed:${sortDirection}`
    };
    
    onFiltersChange(filters);
  };

  const toggleBreed = (breed: string) => {
    setSelectedBreeds(prevBreeds => 
      prevBreeds.includes(breed)
        ? prevBreeds.filter(b => b !== breed)
        : [...prevBreeds, breed]
    );
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onFiltersChange({
      breeds: selectedBreeds,
      ageMin: ageMin ? Number(ageMin) : undefined,
      ageMax: ageMax ? Number(ageMax) : undefined,
      sort: `breed:${newDirection}`
    });
  };

  const filteredBreeds = searchTerm 
    ? allBreeds.filter(breed => breed.toLowerCase().includes(searchTerm.toLowerCase()))
    : allBreeds;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Filter Dogs</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Breed Filter */}
        <div>
          <label className="block font-medium mb-2">Breeds</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBreedDropdown(!showBreedDropdown)}
              className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md"
            >
              <span>
                {selectedBreeds.length === 0 
                  ? 'Select breeds' 
                  : `${selectedBreeds.length} breed${selectedBreeds.length > 1 ? 's' : ''} selected`}
              </span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showBreedDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search breeds..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {isLoading ? (
                  <div className="p-4 text-center">Loading breeds...</div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">{error}</div>
                ) : (
                  <div>
                    {filteredBreeds.map((breed) => (
                      <div key={breed} className="px-4 py-2 hover:bg-gray-100">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBreeds.includes(breed)}
                            onChange={() => toggleBreed(breed)}
                            className="rounded text-blue-500"
                          />
                          <span>{breed}</span>
                        </label>
                      </div>
                    ))}
                    {filteredBreeds.length === 0 && (
                      <div className="px-4 py-2 ">No breeds found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Age Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ageMin" className="block font-medium mb-2">
              Min Age
            </label>
            <input
              type="number"
              id="ageMin"
              min="0"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Min age"
            />
          </div>
          <div>
            <label htmlFor="ageMax" className="block font-medium mb-2">
              Max Age
            </label>
            <input
              type="number"
              id="ageMax"
              min={ageMin || "0"}
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Max age"
            />
          </div>
        </div>
        
        {/* Sort Order */}
        <div>
          <label className="block font-medium mb-2">Sort by Breed</label>
          <button
            type="button"
            onClick={toggleSortDirection}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <span className="mr-2">
              {sortDirection === 'asc' ? 'Ascending (A-Z)' : 'Descending (Z-A)'}
            </span>
            {sortDirection === 'asc' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}