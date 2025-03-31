const CACHE_KEY = 'connections_puzzle_cache';
const CACHE_TIMESTAMP_KEY = 'connections_puzzle_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

// Use environment-appropriate API URL
const getApiBaseUrl = () => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api';
  }
  
  // In production, use relative URLs that will resolve to Vercel API routes
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to format date consistently
function formatDate(date) {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(fetchFn) {
  let lastError;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt + 1} failed:`, error);
      if (attempt < MAX_RETRIES - 1) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

export async function getGoogleSheetsData() {
  console.log('Starting getGoogleSheetsData...');
  
  // Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  
  console.log('Cache check:', {
    hasCachedData: !!cachedData,
    hasTimestamp: !!cacheTimestamp,
    timestamp: cacheTimestamp ? new Date(parseInt(cacheTimestamp)).toISOString() : null
  });
  
  if (cachedData && cacheTimestamp) {
    const now = Date.now();
    if (now - parseInt(cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached data from localStorage');
      return JSON.parse(cachedData);
    }
    console.log('Cache expired, fetching fresh data');
  }

  console.log('Proceeding with API call...');
  return await fetchWithRetry(async () => {
    try {
      console.log('Fetching data from API:', `${API_BASE_URL}/puzzles`);
      const response = await fetch(`${API_BASE_URL}/puzzles`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received from API:', data);

      // Cache the results
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('Data cached in localStorage');

      return data;
    } catch (error) {
      console.error('Error in fetchWithRetry:', error);
      throw error;
    }
  });
}

export async function getPuzzleForDate(targetDate) {
  try {
    console.log('Getting puzzle for date:', targetDate);
    const formattedDate = formatDate(targetDate);
    console.log('Formatted date for API:', formattedDate);
    
    const response = await fetch(`${API_BASE_URL}/puzzles/${formattedDate}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const puzzles = await response.json();
    console.log('Puzzles for date:', puzzles);
    
    return puzzles;
  } catch (error) {
    console.error('Error getting puzzle for date:', error);
    throw error;
  }
} 