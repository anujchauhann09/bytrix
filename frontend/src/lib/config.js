
const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/v1/',
  
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

if (!config.API_BASE_URL) {
  throw new Error('API_BASE_URL is required. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.');
}

if (!config.API_BASE_URL.endsWith('/')) {
  config.API_BASE_URL += '/';
}

export default config; 