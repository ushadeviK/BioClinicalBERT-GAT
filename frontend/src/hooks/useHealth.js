import { useState, useEffect, useCallback } from 'react';
import { predictionApi } from '../api/predictionApi';

/**
 * Hook to poll or trigger checking of backend api health.
 */
export function useHealth() {
  const [status, setStatus] = useState('Checking...');
  const [details, setDetails] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = useCallback(async () => {
    setStatus('Checking...');
    try {
      const data = await predictionApi.checkHealth();
      if (data && (data.status === 'healthy' || data.status === 'ok')) {
        setStatus('Connected');
        setIsConnected(true);
        setDetails(data);
      } else {
        setStatus('Unexpected response');
        setIsConnected(false);
      }
    } catch (error) {
      setStatus('Offline');
      setIsConnected(false);
      setDetails(null);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    // Poll connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    status,
    details,
    isConnected,
    refetch: checkConnection
  };
}
