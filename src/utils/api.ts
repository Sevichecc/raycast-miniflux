import fetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import { Preferences, MinifluxApiError, MinifluxEntries } from "./types";

const fetchEntries = async (queryParams: string): Promise<MinifluxEntries> => {
  const preference: Preferences = getPreferenceValues();
  const { baseUrl, apiKey } = preference;

  const apiUrl = baseUrl.charAt(baseUrl.length - 1) === "/" ? baseUrl.slice(0, -1) : baseUrl;

  const response = await fetch(`${apiUrl}/v1/entries${queryParams}`, {
    method: "get",
    headers: {
      "X-Auth-Token": `${apiKey}`,
    },
  });

  if (!response.ok) {
    throw (await response.json()) as MinifluxApiError;
  }

  return (await response.json()) as MinifluxEntries;
};

export const searchEntries = async (q: string): Promise<MinifluxEntries> => {
  const preference: Preferences = getPreferenceValues();
  const { searchLimit } = preference;

  return await fetchEntries(`?search=${q}&limit=${searchLimit}`);
};

export const getLatestEntries = async (): Promise<MinifluxEntries> => {
  const preference: Preferences = getPreferenceValues();
  const { feedLimit, entryStatus } = preference;

  return await fetchEntries(`?${entryStatus && ""}&limit=${feedLimit}`);
};
