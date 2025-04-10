// services/api.ts
import { Dog, Match, SearchResponse } from '@/types';
import axios from 'axios';
// import { SetStateAction } from 'react';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for handling auth cookies
});

// Auth endpoints
export const login = async (name: string, email: string) => {
  return api.post('/auth/login', { name, email });
};

export const logout = async () => {
  return api.post('/auth/logout');
};

// Dog endpoints
export const getBreeds = async () => {
  const response = await api.get('/dogs/breeds');
  console.log(response.data)
  return response.data as string[];
};

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

export const searchDogs = async (params: SearchParams) => {
  const response = await api.get('/dogs/search', { params });
  return response.data as SearchResponse;
};

export const getDogs = async (dogIds: string[]) => {
  const response = await api.post('/dogs', dogIds);
  return response.data as Dog[];
};

export const getMatch = async (dogIds: string[]) => {
  const response = await api.post('/dogs/match', dogIds);
  return response.data as Match;
};

// Location endpoints
export const getLocations = async (zipCodes: string[]) => {
  const response = await api.post('/locations', zipCodes);
  return response.data;
};

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: { lat: number; lon: number };
    top_right?: { lat: number; lon: number };
  };
  size?: number;
  from?: number;
}

export const searchLocations = async (params: LocationSearchParams) => {
  const response = await api.post('/locations/search', params);
  return response.data;
};

export default api;