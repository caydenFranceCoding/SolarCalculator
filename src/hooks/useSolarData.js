// src/hooks/useSolarData.js
import { useState, useEffect, useCallback } from 'react';

const CONSTANTS = {
  INITIAL_MARKUP: 1.30, // 30% markup
  FINANCE_MARKUP: 1.3399, // Finance fee markup
  FEDERAL_TAX_CREDIT: 0.30, // 30% federal tax credit
  LOAN_TERM_MONTHS: 300, // 25 years * 12 months
  ENHANCEMENT_FACTOR: 1.25 // 25% enhancement on Google estimates
};

export const useSolarData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateEnhancedPricing = useCallback((baseData) => {
    if (!baseData?.financial?.totalCost) return baseData;

    const enhancedData = { ...baseData };
    const baseCost = baseData.financial.totalCost * CONSTANTS.ENHANCEMENT_FACTOR;

    // Cash purchase calculations
    const totalCostWithMarkup = baseCost * CONSTANTS.INITIAL_MARKUP;
    const afterTaxCredit = totalCostWithMarkup * (1 - CONSTANTS.FEDERAL_TAX_CREDIT);

    // Finance calculations
    const financedTotal = totalCostWithMarkup * CONSTANTS.FINANCE_MARKUP;
    const financedAfterTaxCredit = financedTotal * (1 - CONSTANTS.FEDERAL_TAX_CREDIT);
    const monthlyPayment = financedAfterTaxCredit / CONSTANTS.LOAN_TERM_MONTHS;

    enhancedData.financial = {
      ...enhancedData.financial,
      totalCost: Math.round(totalCostWithMarkup),
      netCost: Math.round(afterTaxCredit),
      financedTotal: Math.round(financedTotal),
      financedNetCost: Math.round(financedAfterTaxCredit),
      monthlyPayment: Math.round(monthlyPayment),
      federalTaxCredit: CONSTANTS.FEDERAL_TAX_CREDIT * 100
    };

    return enhancedData;
  }, []);

  // Rest of the hook implementation...
  // (Include your existing fetch and error handling logic)

  const fetchSolarData = useCallback(async (electricBill, address) => {
    if (!electricBill || !address) {
      setError('Electric bill and address are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q2_electricBill: electricBill,
          q1_address: address
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const enhancedData = calculateEnhancedPricing(responseData);
      setData(enhancedData);
      localStorage.setItem('solarData', JSON.stringify(enhancedData));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching solar data:', err);
    } finally {
      setLoading(false);
    }
  }, [calculateEnhancedPricing]);

  return {
    data,
    loading,
    error,
    fetchSolarData,
  };
};
