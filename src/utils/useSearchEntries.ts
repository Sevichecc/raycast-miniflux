import { useCallback, useEffect, useState } from "react";
import { MinifluxApiError, MinifluxEntries, State } from "./types";
import { search, getRecentEntries } from "./api";
import { useErrorHandler } from "../utils/useErrorHandler";

export const useSearchEntries = (searchText: string) => {
  const [state, setState] = useState<State>({ isLoading: false });
  const handleError = useErrorHandler();

  const fetchData = useCallback(async () => {
    setState((oldState) => ({ ...oldState, isLoading: true }));

    try {
      const entries: MinifluxEntries = searchText ? await search(searchText) : await getRecentEntries();
      setState({ ...entries, isLoading: false });
    } catch (error) {
      handleError(error as MinifluxApiError);
      setState((oldState) => ({ ...oldState, isLoading: false }));
    }
  }, [searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
};
