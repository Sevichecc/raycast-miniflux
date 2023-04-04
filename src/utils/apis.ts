import fetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import { Preferences, MinifluxApiError, MinifluxEntries, MinifluxEntry, IconData } from "./types";

const removeTrailingSlash = (baseUrl: string): string =>
  baseUrl.charAt(baseUrl.length - 1) === "/" ? baseUrl.slice(0, -1) : baseUrl;

const fetchData = async <T>(urlPath: string, queryParams?: string): Promise<T> => {
  const preferences: Preferences = getPreferenceValues();
  const { baseUrl, apiKey } = preferences;
  const apiUrl = removeTrailingSlash(baseUrl);

  const response = await fetch(apiUrl + urlPath + (queryParams || ""), {
    method: "get",
    headers: {
      "X-Auth-Token": apiKey,
    },
  });

  if (!response.ok) {
    throw (await response.json()) as MinifluxApiError;
  }

  return (await response.json()) as T;
};

export const fetchEntriesWithParams = async <T>(queryParams: string): Promise<T> => {
  return await fetchData<T>("/v1/entries", queryParams);
};

export const search = async (query: string): Promise<MinifluxEntries> => {
  const preferences: Preferences = getPreferenceValues();
  const { searchLimit } = preferences;

  return await fetchEntriesWithParams(`?search=${query}${searchLimit ? "&limit=" + searchLimit : ""}`);
};

export const getRecentEntries = async (): Promise<MinifluxEntries> => {
  const preferences: Preferences = getPreferenceValues();
  const { feedLimit } = preferences;

  return await fetchEntriesWithParams(`?limit=${feedLimit}`);
};

export const getEntryUrlInMiniflux = ({ id, status }: MinifluxEntry): string => {
  const preferences: Preferences = getPreferenceValues();
  const { baseUrl } = preferences;
  const entryStatus = status === "read" ? "history" : status;

  return `${baseUrl}/${entryStatus}/entry/${id}`;
};

export const fetchIconForFeed = async ({ feed_id }: MinifluxEntry): Promise<IconData> => {
  return await fetchData<IconData>(`/v1/feeds/${feed_id}/icon`);
};

// export const setEntryStatus = (entry: MinifluxEntry) => {
//   let icon: Icon, toolTip: string;

//   switch (entry.status) {
//     case "read":
//       icon = Icon.CircleProgress100;
//       toolTip = "read";
//       break;
//     case "removed":
//       icon = Icon.MinusCircle;
//       toolTip = "removed";
//       break;
//     default:
//       icon = Icon.Circle;
//       toolTip = "unread";
//   }

//   return [{ icon }];
// };
