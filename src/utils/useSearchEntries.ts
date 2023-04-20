import { useCallback, useEffect, useState } from "react";
import { MinifluxApiError, MinifluxEntries, State } from "./types";
import { search } from "./api";
import { useErrorHandler } from "../utils/useErrorHandler";
import { Cache } from "@raycast/api";

const cache = new Cache();

export const useSearchEntries = (searchText: string) => {
  const cached = cache.get("search-results");

  const [state, setState] = useState<State>({
    entries: cached ? JSON.parse(cached) : [],
    isLoading: false,
  });

  const handleError = useErrorHandler();

  const fetchData = useCallback(async () => {
    if (!searchText) return;
    
    setState((oldState) => ({ ...oldState, isLoading: true }));

    try {
      const { total, entries }: MinifluxEntries = await search(searchText);
      setState({ total, entries, isLoading: false });
      cache.set("search-results", JSON.stringify(entries));
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
