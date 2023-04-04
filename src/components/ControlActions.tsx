/* eslint-disable @raycast/prefer-title-case */
import { useCallback } from "react";
import { ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { getEntryUrlInMiniflux, toggleBookmark } from "../utils/api";
import { MinifluxEntry } from "../utils/types";
import FeedInDetail from "./FeedInDetail";

const ControlActions = ({ entry }: { entry: MinifluxEntry }) => {

  const handleBookmarkd = useCallback(async (entry: MinifluxEntry): Promise<void> => {
    try {
      showToast(Toast.Style.Animated, "Bookmarking article");
      
      await toggleBookmark(entry);

      showToast(Toast.Style.Success, `The article has been ${entry.starred ? "unstarred" : "starred"}`);
    } catch (error) {
      showToast(Toast.Style.Failure, `Failed to ${entry.starred ? "unstar" : "star"} the article`);
    }
  },[entry])

  return (
    <ActionPanel title={entry.title}>
      <Action.OpenInBrowser url={entry.url} />
      <Action.OpenInBrowser
        title="Open in Miniflux"
        shortcut={{ modifiers: ["opt"], key: "arrowDown" }}
        url={getEntryUrlInMiniflux(entry)}
      />
      <Action.Push title="Fetch Original Article and Read" target={<FeedInDetail entry={entry} />} />
      <Action onAction={() => handleBookmarkd(entry)} title="Star / Unstar this article" />
    </ActionPanel>
  );
};

export default ControlActions;
