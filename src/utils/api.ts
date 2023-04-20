import fetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import {
  Preferences,
  MinifluxApiError,
  MinifluxEntries,
  MinifluxEntry,
  IconData,
  OriginArticle,
  Category,
} from "./types";

const removeTrailingSlash = (baseUrl: string): string => (baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl);

const requestApi = async <T>(
  endpoint: string,
  queryParams?: string,
  method: "GET" | "POST" | "PUT" = "GET"
): Promise<T> => {
  const { baseUrl, apiKey } = getPreferenceValues<Preferences>();
  const apiUrl = removeTrailingSlash(baseUrl);

  const response = await fetch(apiUrl + endpoint + (queryParams || ""), {
    method,
    headers: { "X-Auth-Token": apiKey },
  });

  if (!response.ok) {
    throw (await response.json()) as MinifluxApiError;
  }

  return (await response.json()) as T;
};

const getEntriesWithParams = async <T>(queryParams: string): Promise<T> => requestApi<T>("/v1/entries", queryParams);

const search = async (query: string): Promise<MinifluxEntries> => {
  const { searchLimit } = getPreferenceValues<Preferences>();

  return getEntriesWithParams<MinifluxEntries>(`?search=${query}${searchLimit ? "&limit=" + searchLimit : ""}`);
};

const getRecentEntries = async (): Promise<MinifluxEntries> => {
  const { feedLimit } = getPreferenceValues<Preferences>();
  return getEntriesWithParams<MinifluxEntries>(`?status=unread&direction=desc&limit=${feedLimit}`);
};

const getEntryUrlInMiniflux = ({ id, status }: MinifluxEntry): string => {
  const { baseUrl } = getPreferenceValues<Preferences>();
  const entryStatus = status === "read" ? "history" : status;

  return `${baseUrl}/${entryStatus}/entry/${id}`;
};

const getIconForFeed = async ({ feed_id }: MinifluxEntry): Promise<IconData> =>
  requestApi<IconData>(`/v1/feeds/${feed_id}/icon`);

const getOriginArticle = async ({ id }: MinifluxEntry): Promise<OriginArticle> =>
  requestApi<OriginArticle>(`/v1/entries/${id}/fetch-content`);

const getCategories = async (): Promise<Category[]> => requestApi<Category[]>("/v1/categories");

const toggleBookmark = async ({ id }: MinifluxEntry): Promise<boolean> =>
  (await requestApi<number>(`/v1/entries/${id}/bookmark`, "", "PUT")) === 204;

export default {
  search,
  getRecentEntries,
  getEntryUrlInMiniflux,
  getIconForFeed,
  getOriginArticle,
  getCategories,
  toggleBookmark,
};
