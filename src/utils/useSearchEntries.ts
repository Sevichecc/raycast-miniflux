import { useEffect, useState } from "react";
import { MinifluxApiError, MinifluxEntry } from "./types";
import { search } from "./apis";

interface State {
  isLoading: boolean;
  error?: MinifluxApiError;
  entries?: MinifluxEntry[];
}

export const useSearchEntries = (searchText: string) => {
  const [state, setState] = useState<State>({ isLoading: false });

  useEffect(() => {
    if (!searchText) {
      setState({ isLoading: false });
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setState((oldState) => ({ ...oldState, isLoading: true }));

      try {
        const { entries } = await search(searchText);

        if (isMounted) {
          setState((oldState) => ({ ...oldState, entries }));
        }
      } catch (error) {
        console.log(error as MinifluxApiError);
      } finally {
        if (isMounted) {
          setState((oldState) => ({ ...oldState, isLoading: false }));
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [searchText]);

  return state;
};
