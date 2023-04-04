import { Image } from "@raycast/api";
import { MinifluxEntry, IconData } from "./types";
import { useEffect, useState } from "react";
import { getIconForFeed } from "./api";

export const useEntryIcon = (entry: MinifluxEntry): Image.ImageLike => {
  const [icon, setIcon] = useState<Image.ImageLike>({ source: "" });

  useEffect(() => {
    let isMounted = true;

    const fetchIcon = async () => {
      try {
        const { data }: IconData = await getIconForFeed(entry);
        if (isMounted) {
          setIcon({
            source: "data:" + data,
            mask: Image.Mask.RoundedRectangle,
          });
        }
      } catch (error) {
        console.error("Error fetching icon:", error);
        setIcon({ source: "" });
      }
    };

    fetchIcon();

    return () => {
      isMounted = false;
    };
  }, [entry]);

  return icon;
};
