import axios from 'axios';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Create TMDB axios instance
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Image URL helper
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Get backdrop URL
export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Get poster URL
export const getPosterUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Get profile URL
export const getProfileUrl = (path, size = 'w185') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// TMDB API service
export const tmdbService = {
  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page, include_adult: false }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB search error:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits,videos,images,reviews,similar,recommendations'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB movie details error:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('TMDB popular movies error:', error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('TMDB top rated movies error:', error);
      throw error;
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('TMDB now playing movies error:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/upcoming', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('TMDB upcoming movies error:', error);
      throw error;
    }
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow = 'week') => {
    try {
      const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('TMDB trending movies error:', error);
      throw error;
    }
  },

  // Get movie genres
  getMovieGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('TMDB genres error:', error);
      throw error;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB movies by genre error:', error);
      throw error;
    }
  },

  // Get person details
  getPersonDetails: async (personId) => {
    try {
      const response = await tmdbApi.get(`/person/${personId}`, {
        params: {
          append_to_response: 'movie_credits,images'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB person details error:', error);
      throw error;
    }
  },

  // Search people
  searchPeople: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/person', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB search people error:', error);
      throw error;
    }
  },

  // Get configuration
  getConfiguration: async () => {
    try {
      const response = await tmdbApi.get('/configuration');
      return response.data;
    } catch (error) {
      console.error('TMDB configuration error:', error);
      throw error;
    }
  },
};

// Transform TMDB movie data to our format
export const transformMovieData = (tmdbMovie) => {
  return {
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title,
    description: tmdbMovie.overview,
    synopsis: tmdbMovie.overview,
    releaseYear: new Date(tmdbMovie.release_date).getFullYear(),
    releaseDate: tmdbMovie.release_date,
    genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids[0] : null,
    genres: tmdbMovie.genres || [],
    posterUrl: getPosterUrl(tmdbMovie.poster_path),
    backdropUrl: getBackdropUrl(tmdbMovie.backdrop_path),
    popularity: tmdbMovie.popularity,
    voteAverage: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    adult: tmdbMovie.adult,
    originalLanguage: tmdbMovie.original_language,
    video: tmdbMovie.video,
  };
};

// Transform TMDB person data to our format
export const transformPersonData = (tmdbPerson) => {
  return {
    tmdbId: tmdbPerson.id,
    name: tmdbPerson.name,
    originalName: tmdbPerson.original_name,
    profileUrl: getProfileUrl(tmdbPerson.profile_path),
    popularity: tmdbPerson.popularity,
    knownFor: tmdbPerson.known_for || [],
    adult: tmdbPerson.adult,
    gender: tmdbPerson.gender,
    knownForDepartment: tmdbPerson.known_for_department,
  };
};

// Get movie trailer URL
export const getTrailerUrl = (videos) => {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

// Get movie trailer embed URL
export const getTrailerEmbedUrl = (videos) => {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
};

// Format runtime
export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Format budget
export const formatBudget = (budget) => {
  if (!budget) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(budget);
};

// Format revenue
export const formatRevenue = (revenue) => {
  if (!revenue) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(revenue);
};

export default tmdbService;
