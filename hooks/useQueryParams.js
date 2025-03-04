import { useLocation, useNavigate } from "react-router-dom";

/**
 * Converts a JSON object into a query string, excluding null/empty values.
 */
export const jsonToQueryParams = (params) => {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== null && value !== "")
  ).toString();

  return queryString ? `?${queryString}` : "";
};

/**
 * Custom hook for managing query params and route state in React Router
 */
const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const routeState = location.state || {}; // Preserve existing state

  /**
   * Updates a single query parameter while preserving other existing params.
   */
  const updateQueryParam = (key, value, preserveExistingParams = true) => {
    const newParams = preserveExistingParams ? Object.fromEntries(queryParams.entries()) : {};
    
    if (value !== null && value !== undefined && value !== "") {
      newParams[key] = value;
    } else {
      delete newParams[key]; // Remove param if value is null/undefined/empty
    }

    navigate({ search: jsonToQueryParams(newParams) }, { replace: true, state: routeState });
  };

  /**
   * Updates multiple query params while preserving state.
   */
  const updateQueryParams = (newParams, preserveExistingParams = true) => {
    const mergedParams = preserveExistingParams
      ? { ...Object.fromEntries(queryParams.entries()), ...newParams }
      : newParams;

    navigate({ search: jsonToQueryParams(mergedParams) }, { replace: true, state: routeState });
  };

  /**
   * Updates React Router `state` without affecting query params.
   */
  const updateRouteState = (newState) => {
    navigate(location.pathname + location.search, {
      replace: true,
      state: { ...routeState, ...newState },
    });
  };

  return { queryParams, updateQueryParam, updateQueryParams, updateRouteState, location, routeState };
};

export default useQueryParams;
