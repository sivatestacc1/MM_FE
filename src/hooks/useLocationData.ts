import { useState, useEffect } from 'react';
import { State } from '../types';

export function useLocationData() {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/states');
      if (!response.ok) throw new Error('Failed to fetch states');
      const data = await response.json();
      setStates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch states');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateName: string) => {
    try {
      const response = await fetch(`/api/districts/${stateName}`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      const data = await response.json();
      setDistricts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch districts');
    }
  };

  return { states, districts, loading, error, fetchDistricts };
}