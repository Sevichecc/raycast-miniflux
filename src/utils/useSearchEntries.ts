import { useCallback, useEffect, useState } from "react";
import { MinifluxApiError, MinifluxEntries, State } from "./types";
import { search } from "./api";
import { useErrorHandler } from "../utils/useErrorHandler";

export const useSearchEntries = (searchText: string) => {
  const [state, setState] = useState<State>({ isLoading: false });
  const handleError = useErrorHandler();

  const fetchData = useCallback(async () => {
    setState((oldState) => ({ ...oldState, isLoading: true }));

    try {
      const { total, entries }: MinifluxEntries = await search(searchText);
      setState({ total, entries, isLoading: false });
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
