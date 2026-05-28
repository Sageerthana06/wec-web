import { createContext, useContext, useState, useEffect } from 'react';
import { companyService } from '../services/api';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await companyService.getDetails();
      if (res.success) {
        setDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load company details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        details,
        loading,
        error,
        refreshDetails: fetchDetails,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
