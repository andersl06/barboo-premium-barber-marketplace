import { api } from "./index";

export interface SearchBarbershop {
  id: number;
  name: string;
  logo_url?: string | null;
  city?: string | null;
  state?: string | null;
  [key: string]: any;
}

export interface SearchService {
  id: number;
  barbershop_id: number;
  name: string;
  price: number;
  duration: number;
  barbershops: {
    name: string;
    city: string;
    state: string;
  };
  [key: string]: any;
}

export interface SearchBarber {
  id: number;
  name: string;
  avatar_url?: string | null;
}

export interface SearchResult {
  barbershops: SearchBarbershop[];
  services: SearchService[];
  barbers: SearchBarber[];
}

export const searchApi = {
  search: (query: string): Promise<SearchResult> => {
    // backend espera ?q=
    return api.get(`/search?q=${encodeURIComponent(query)}`);
  }
};
