import React, { useState, useCallback } from 'react';
import { Edit2, Sun, Battery, DollarSign } from 'lucide-react';
import MapComponent from './MapComponent';
import { useSolarData } from './hooks/useSolarData';

const CONSTANTS = {
  INITIAL_MARKUP: 1.30,
  FINANCE_MARKUP: 1.3399,
  FEDERAL_TAX_CREDIT: 0.30,
  LOAN_TERM_MONTHS: 300
};

const InspireSolarResults = () => {
  const [paymentOption, setPaymentOption] = useState('CASH');
  const [testAddress, setTestAddress] = useState('');
  const [testBill, setTestBill] = useState('');
  const { data: solarData, loading, error, fetchSolarData } = useSolarData();

  const calculateFinancingDetails = useCallback((totalCost) => {
    const financedTotal = totalCost * CONSTANTS.FINANCE_MARKUP;
    const afterTaxCredit = financedTotal * (1 - CONSTANTS.FEDERAL_TAX_CREDIT);
    const monthlyPayment = afterTaxCredit / CONSTANTS.LOAN_TERM_MONTHS;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalLoanCost: Math.round(financedTotal),
      netCost: Math.round(afterTaxCredit),
      apr: 4.99,
      term: 25
    };
  }, []);

  const handleCalculate = async () => {
    try {
      await fetchSolarData(testBill || '300', testAddress || '123 Main St');
    } catch (error) {
      console.error('Error calculating solar data:', error);
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('solarData');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculating...</h2>
        </div>
      </div>
    );
  }

  if (!solarData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Test Calculator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Calculator Testing</h3>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Address"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Monthly Electric Bill"
                value={testBill}
                onChange={(e) => setTestBill(e.target.value)}
                className="w-48 p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleCalculate}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Calculate
              </button>
              <button
                onClick={handleClearData}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pricing = calculateFinancingDetails(solarData?.financial?.totalCost || 0);
  const systemSize = solarData?.systemDetails?.systemSize || 0;
  const monthlyBill = solarData?.financial?.monthlyBill || 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Test Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Test Calculator</h3>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Address"
              value={testAddress}
              onChange={(e) => setTestAddress(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Monthly Electric Bill"
              value={testBill}
              onChange={(e) => setTestBill(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleCalculate}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Calculate
            </button>
            <button
              onClick={handleClearData}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Solar Design</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Equipment Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Equipment</h2>
            <h3 className="text-xl text-blue-600 mb-6">({systemSize}kW Solar Panel System)</h3>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700">
                <Sun className="mr-4 text-green-500"/> Full installation of PV system
              </li>
              <li className="flex items-center text-gray-700">
                <Battery className="mr-4 text-green-500"/> 25 yr solar system warranty
              </li>
              <li className="flex items-center text-gray-700">
                <DollarSign className="mr-4 text-green-500"/> Price includes all fees & sales tax
              </li>
            </ul>

            <div className="flex space-x-4 mb-8">
              <button
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
                  paymentOption === 'CASH' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-gray-50 text-gray-600'
                }`}
                onClick={() => setPaymentOption('CASH')}
              >
                CASH
              </button>
              <button
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
                  paymentOption === 'FINANCING' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-50 text-gray-600'
                }`}
                onClick={() => setPaymentOption('FINANCING')}
              >
                FINANCING
              </button>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-bold">
                ${paymentOption === 'CASH' ? pricing.totalLoanCost.toLocaleString() : `${pricing.monthlyPayment}/mo`}
              </span>
              <span className="text-emerald-500">*</span>
            </div>
            <p className="text-sm text-gray-600">* After Federal & State Incentives ${pricing.netCost.toLocaleString()}</p>
            <p className="text-sm text-blue-500">
              ${((pricing.totalLoanCost / (systemSize * 1000)) || 0).toFixed(2)}/watt
            </p>

            {paymentOption === 'FINANCING' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Financing Details:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 4.99% APR</li>
                  <li>• 25-year term</li>
                  <li>• No money down</li>
                  <li>• No prepayment penalties</li>
                </ul>
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <MapComponent
                address={solarData?.address || ''}
                systemSize={systemSize}
              />
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Estimated electrical offset</h3>
                  <p className="text-sm text-gray-600">Previous monthly bill</p>
                  <p className="text-xs text-gray-500">
                    Est. annual usage {solarData?.systemDetails?.annualProduction?.toLocaleString() || 0}kWh
                  </p>
                </div>
                <div className="text-right">
                  <button className="text-blue-500 text-sm hover:text-blue-600 flex items-center">
                    Edit <Edit2 className="ml-1 h-4 w-4"/>
                  </button>
                  <p className="text-3xl font-bold text-gray-800 mt-2">${monthlyBill}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 bg-gray-100 p-4 rounded-lg">
                <span className="text-gray-700 font-medium">System Size</span>
                <span className="text-2xl font-semibold text-blue-600">{systemSize} kW</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">System Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Panels:</span>
                <span className="font-medium">
                  {solarData?.systemDetails?.panelCount || 0} x {solarData?.systemDetails?.panelWattage || 405}W
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Inverter:</span>
                <span className="font-medium">{solarData?.systemDetails?.inverterType || 'Enphase IQ8+'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Annual Production:</span>
                <span className="font-medium">
                  {solarData?.systemDetails?.annualProduction?.toLocaleString() || 0} kWh
                </span>
              </div>
            </div>
          </div>

          {/* 25-Year Savings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">25-Year Savings Estimate</h3>
            <div className="text-3xl font-bold text-emerald-500 mb-2">
              ${(solarData?.financial?.estimatedSavings?.twentyFiveYear || 0).toLocaleString()}+
            </div>
            <p className="text-sm text-gray-600">Based on current electricity rates and usage</p>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Environmental Impact</h3>
            <p className="text-gray-600 mb-2">Equivalent to planting:</p>
            <div className="text-3xl font-bold text-emerald-500 mb-2">
              {solarData?.environmental?.treesEquivalent || 0} trees
            </div>
            <p className="text-sm text-gray-600">CO2 offset over system lifetime</p>
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-8 text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to go solar?</h2>
          <p className="text-xl mb-6">Take the next step towards energy independence</p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Schedule Your Consultation
          </button>
        </div>

        <div className="text-sm text-gray-600 space-y-2 mb-8">
          <p>* Estimate assumes roof mount and the roof is in good condition, there is clear attic run space, and no electrical upgrades are required to complete installation.</p>
          <p>* Pricing is subject to change based on individual solar consultation.</p>
          {paymentOption === 'FINANCING' && (
            <p>* Assumes that you qualify for federal tax credits and apply them to the loan value for your monthly cost.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default InspireSolarResults;