// app/match/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDogs } from '@/services/api';
import { Dog } from '@/types';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';

export default function MatchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/');
      return;
    }

    const fetchMatchedDog = async () => {
      try {
        setIsLoading(true);
        
        // Get match result from localStorage
        const matchResultString = localStorage.getItem('matchResult');
        if (!matchResultString) {
          setError('No match result found. Please try searching again.');
          setIsLoading(false);
          return;
        }
        
        const matchResult = JSON.parse(matchResultString);
        const { matchId } = matchResult;
        
        if (!matchId) {
          setError('Invalid match result. Please try again.');
          setIsLoading(false);
          return;
        }
        
        // Fetch the matched dog details
        const dogData = await getDogs([matchId]);
        if (dogData && dogData.length > 0) {
          setMatchedDog(dogData[0]);
        } else {
          setError('Could not find details for your matched dog.');
        }
      } catch (err) {
        console.error('Error fetching matched dog:', err);
        setError('Failed to load your matched dog. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchedDog();
  }, [user, router]);

  if (!user) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
              <Link href="/search" className="mt-4 inline-block text-blue-500 hover:underline">
                Back to Search
              </Link>
            </div>
          ) : matchedDog ? (
            <div className="text-center">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Congratulations!</h1>
                <p className="text-xl">You&#39;ve been matched with</p>
              </div>
              
              <div className="mb-8">
                <div className="relative w-64 h-64 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={matchedDog.img}
                    alt={matchedDog.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{matchedDog.name}</h2>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">About {matchedDog.name}</h3>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  <div className="text-left">
                    <span className="">Breed:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{matchedDog.breed}</span>
                  </div>
                  
                  <div className="text-left">
                    <span className="">Age:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{matchedDog.age} years</span>
                  </div>
                  
                  <div className="text-left">
                    <span className="">Location:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">ZIP: {matchedDog.zip_code}</span>
                  </div>
                </div>
              </div>
              
              <div className=" mb-6">
                <p>Thank you for using our service to find your perfect companion!</p>
                <p className="mt-2">Contact the shelter using the information provided to start the adoption process.</p>
              </div>
              
              <Link href="/search" className="inline-block bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Back to Search
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="">No match found. Please try again.</p>
              <Link href="/search" className="mt-4 inline-block text-blue-500 hover:underline">
                Back to Search
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}