import { Image, Cache } from "@raycast/api";
import { MinifluxEntry, IconInfo } from "./types";
import { useEffect, useState } from "react";
import apiServer from "./api";

const cache = new Cache();

export const useEntryIcon = (entry: MinifluxEntry): Image.ImageLike => {
  const [icon, setIcon] = useState<Image.ImageLike>({ source: "" });
  const cachedIcon = cache.get(`icon-${entry.feed_id}`);

  useEffect(() => {
    const fetchIcon = async () => {
      if (cachedIcon) {
        setIcon({
          source: cachedIcon,
          mask: Image.Mask.RoundedRectangle,
        });
      } else {
        try {
          const { data }: IconInfo = await apiServer.getIconForFeed(entry);
          const iconSource = "data:" + data;

          setIcon({
            source: iconSource,
            mask: Image.Mask.RoundedRectangle,
          });
          cache.set(`icon-${entry.feed_id}`, iconSource);
        } catch (error) {
          console.error(`Error fetching icon for feed: ${entry.feed.title}`, error);
          setIcon({ source: "" });
        }
      }
    };

    fetchIcon();
  }, [entry.feed_id, cachedIcon]);

  return icon;
};
