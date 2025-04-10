// app/search/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { searchDogs, getDogs, SearchParams } from '@/services/api';
import { Dog, SearchResponse } from '@/types';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import DogCard from '@/components/DogCard';
import Pagination from '@/components/Pagination';
import FavoritesPanel from '@/components/FavoritesPanel';

// Helper function to extract page number from cursor
// const getPageFromCursor = (cursor: string | null) => {
//   if (!cursor) return null;
//   const fromMatch = cursor.match(/from=(\d+)/);
//   return fromMatch ? parseInt(fromMatch[1]) : null;
// };

export default function SearchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchParams>({
    size: 12,
    sort: 'breed:asc',
  });

  // Check authentication status
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Fetch dogs when filters or page changes
  useEffect(() => {
    if (!user) return;

    const fetchDogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate from parameter based on current page and size
        const size = filters.size || 12;
        const from = currentPage > 1 ? ((currentPage - 1) * size).toString() : undefined;
        
        // Make the search request
        const searchResult = await searchDogs({
          ...filters,
          from
        });
        
        setSearchResponse(searchResult);
        
        // Calculate total pages
        const total = searchResult ? searchResult.total : 0;
        const calculatedTotalPages = Math.ceil(total / size);
        setTotalPages(calculatedTotalPages);
        
        // Fetch the actual dog data
        if (searchResult.resultIds.length > 0) {
          const dogsData = await getDogs(searchResult.resultIds);
          setDogs(dogsData);
        } else {
          setDogs([]);
        }
      } catch (err) {
        console.error('Error fetching dogs:', err);
        setError('Failed to fetch dogs. Please try again.');
        setDogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [filters, currentPage, user]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFiltersChange = (newFilters: {
    breeds: string[];
    ageMin?: number;
    ageMax?: number;
    sort: string;
  }) => {
    // Reset to first page when filters change
    setCurrentPage(1);
    setFilters(prevFilters => ({
      ...prevFilters,
      breeds: newFilters.breeds.length > 0 ? newFilters.breeds : undefined,
      ageMin: newFilters.ageMin,
      ageMax: newFilters.ageMax,
      sort: newFilters.sort,
    }));
  };

  if (!user) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:gap-8">
          {/* Filters sidebar */}
          <div className="md:w-1/4 mb-6 md:mb-0">
            <SearchFilters 
              onFiltersChange={handleFiltersChange}
              currentSort={filters.sort || 'breed:asc'}
            />
          </div>
          
          {/* Results area */}
          <div className="md:w-3/4">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Available Dogs</h2>
                {searchResponse && (
                  <span className=" ">
                    {searchResponse.total} {searchResponse.total === 1 ? 'dog' : 'dogs'} found
                  </span>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : dogs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className=" ">No dogs found matching your criteria.</p>
                <p className="  mt-2">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dogs.map(dog => (
                    <DogCard key={dog.id} dog={dog} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <FavoritesPanel />
    </div>
  );
}