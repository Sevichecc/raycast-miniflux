/* eslint-disable @raycast/prefer-title-case */
import { useCallback } from "react";
import { ActionPanel, Action, showToast, Toast, Icon } from "@raycast/api";
import apiServer from "../utils/api";
import { MinifluxEntry } from "../utils/types";
import FeedInDetail from "./FeedInDetail";

const ControlActions = ({ entry }: { entry: MinifluxEntry }) => {
  const handleBookmarkd = useCallback(
    async (entry: MinifluxEntry): Promise<void> => {
      try {
        showToast(Toast.Style.Animated, "Bookmarking article");

        await apiServer.toggleBookmark(entry);

        showToast(Toast.Style.Success, `The article has been ${entry.starred ? "unstarred" : "starred"}`);
      } catch (error) {
        showToast(Toast.Style.Failure, `Failed to ${entry.starred ? "unstar" : "star"} the article`);
      }
    },
    [entry]
  );

  return (
    <ActionPanel title={entry.title}>
      <Action.OpenInBrowser url={entry.url} title="Open in Browser with original link" />
      <Action.OpenInBrowser
        title="Open in Miniflux"
        shortcut={{ modifiers: ["opt"], key: "arrowDown" }}
        url={apiServer.getEntryUrlInMiniflux(entry)}
        icon={Icon.Link}
      />
      <Action.Push title="Fetch original Article" target={<FeedInDetail entry={entry} />} icon={Icon.SaveDocument} />
      <Action
        onAction={() => handleBookmarkd(entry)}
        title={`${entry.starred ? "Unstar" : "Star"} this article`}
        icon={entry.starred ? Icon.StarDisabled : Icon.Star}
      />
    </ActionPanel>
  );
};

export default ControlActions;
