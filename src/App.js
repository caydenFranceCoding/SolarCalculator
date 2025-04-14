import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InspireSolarResults from './InspireSolarResults';

// Debug Panel component
const DebugPanel = ({ data }) => (
  <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-50">
    <h3 className="font-bold mb-2">Debug Info:</h3>
    <pre className="text-xs overflow-auto max-h-48 bg-gray-100 p-2 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

// Results wrapper component
const ResultsWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return <InspireSolarResults />;
};

// Main App component
function App() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      setKey(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          localStorage.getItem('solarData') ||
          sessionStorage.getItem('solarData') ||
          new URLSearchParams(window.location.search).get('data')
            ? <Navigate to="/solar-quote" replace />
            : <ResultsWrapper />
        }
      />
      <Route path="/solar-quote" element={<ResultsWrapper key={key} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;