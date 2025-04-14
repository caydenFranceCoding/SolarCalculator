// src/config/api.js

// Get API URL from environment variables with fallback
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  SOLAR_CALCULATION: '/',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Solar calculation constants
export const SOLAR_CONSTANTS = {
  PANEL_WATTAGE: 405,
  KWH_PER_KW: 1400,
  COST_PER_WATT: 2.80,
  MARKUP_FACTOR: 1.30,
  ELECTRIC_RATE: 0.14,
  TAX_CREDIT: 0.30
};

export default {
  API_URL,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  SOLAR_CONSTANTS,
};