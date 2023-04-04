import { showToast, Toast, popToRoot } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { MinifluxApiError, MinifluxEntry, MinifluxEntries } from "./types";
import { search, getRecentEntries } from "./apis";

interface State {
  isLoading: boolean;
  error?: MinifluxApiError;
  entries?: MinifluxEntry[];
}

export const useSearchEntries = (searchText: string) => {
  const [state, setState] = useState<State>({ isLoading: false });

  const fetchData = useCallback(async () => {
    setState((oldState) => ({ ...oldState, isLoading: true }));

    try {
      const entries: MinifluxEntries = searchText ? await search(searchText) : await getRecentEntries();
      setState({ ...entries, isLoading: false });
    } catch (error) {
      const apiError = error as MinifluxApiError;
      let errorMessage = "Failed to load feeds";
      
      if (apiError?.code === "401") {
        errorMessage = "Invalid Credentials. Check your API key and try again.";
        popToRoot({ clearSearchBar: true });
      }

      showToast(Toast.Style.Failure, errorMessage);
      setState((oldState) => ({ ...oldState, isLoading: false, error: apiError }));
    }
  }, [searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
};
