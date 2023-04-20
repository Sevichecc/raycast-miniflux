import { Cache } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import apiServer from "./api";
import { Category, MinifluxApiError } from "./types";
import { useErrorHandler } from "../utils/useErrorHandler";

const cache = new Cache();
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const handleError = useErrorHandler();

  const fetchData = useCallback(async () => {
    try {
      const fetchedCategories: Category[] = await apiServer.getCategories();
      const cache = new Cache();
      cache.set("categories", JSON.stringify(fetchedCategories));
      setCategories(fetchedCategories);
    } catch (error) {
      handleError(error as MinifluxApiError);
    }
  }, [handleError]);

  useEffect(() => {
    const cachedCategoriesString = cache.get("categories");
    if (cachedCategoriesString) {
      setCategories(JSON.parse(cachedCategoriesString));
    } else {
      fetchData();
    }
  }, [fetchData]);

  return categories;
};
