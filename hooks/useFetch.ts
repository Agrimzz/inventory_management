import api from "@/services/api";
import { useCallback, useEffect, useState } from "react";

// Helper function using Axios
export const fetchAPI = async (url: string, options?: object) => {
  try {
    const response = await api.get(url, options);
    return response.data;
  } catch (error: any) {
    console.error("Fetch error:", error);
    throw new Error(
      error?.response?.data?.message || error.message || "Unknown error"
    );
  }
};

// React hook using the fetchAPI helper
export const useFetch = <T>(url: string, options?: object) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
