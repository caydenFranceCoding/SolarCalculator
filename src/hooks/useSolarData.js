import { useState, useCallback } from 'react';

const CONSTANTS = {
  INITIAL_MARKUP: 1.30,
  FINANCE_MARKUP: 1.3399,
  FEDERAL_TAX_CREDIT: 0.30,
  LOAN_TERM_MONTHS: 300,
  ENHANCEMENT_FACTOR: 1.25
};

export const useSolarData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateEnhancedPricing = useCallback((baseData) => {
    if (!baseData?.financial?.totalCost) return baseData;
    
    // Copy your calculation logic here
    return baseData;
  }, []);

  const fetchSolarData = useCallback(async (electricBill, address) => {
    setLoading(true);
    
    try {
      const response = await fetch('https://backendcalc.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q2_electricBill: electricBill,
          q1_address: address
        })
      });
      
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchSolarData };
};
