import { useState, useEffect, useCallback, useRef } from "react";
const SYSTEM_TOKEN = null;

const useFetch = ({ URL, options = {}, autoFetch = true, systemToken = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchData = useCallback(
    async (fetchOptions = options) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      const signal = controller.signal;
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const token = systemToken ? SYSTEM_TOKEN : localStorage.getItem("token");
        const response = await fetch(URL, {
          ...fetchOptions,
          method: fetchOptions.method || "GET",
          headers: {
            "Content-Type": "application/json",
            "X-JWT-Assertion": token || "",
          },
          signal,
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Something went wrong");
        }

        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [URL, options, systemToken]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, fetchData };
};

export default useFetch;
