// Search API - Official Endpoints
import { api } from "./index";

export const searchApi = {
  search: (query: string) =>
    api.get(`/api/search?q=${encodeURIComponent(query)}`),
};
