import axios from 'axios';

const API_BASE_URL = 'https://suitmedia-backend.suitdev.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface FetchPostsParams {
  page: number;
  pageSize: number;
  sort: string;
}

export interface PostResponse {
  data: Array<{
    id: string;
    title: string;
    small_image: string;
    medium_image: string;
    published_at: string;
  }>;
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const fetchPosts = async (params: FetchPostsParams): Promise<PostResponse> => {
  try {
    const response = await api.get('/ideas', {
      params: {
        'page[number]': params.page,
        'page[size]': params.pageSize,
        'append[]': ['small_image', 'medium_image'],
        'sort': params.sort,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export default api;