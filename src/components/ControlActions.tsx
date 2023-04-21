/* eslint-disable @raycast/prefer-title-case */
import { useCallback } from "react";
import { ActionPanel, Action, showToast, Toast, Icon } from "@raycast/api";
import apiServer from "../utils/api";
import { MinifluxEntry, MinifluxApiError } from "../utils/types";
import FeedInDetail from "./FeedInDetail";
import { useErrorHandler } from "../utils/useErrorHandler";

const ControlActions = ({ entry }: { entry: MinifluxEntry }) => {
  const handleError = useErrorHandler();
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

  const hanleRefresh = useCallback(async () => {
    try {
      showToast(Toast.Style.Animated, "Refreshing all feeds ...ᕕ( ◔3◔)ᕗ");
      await apiServer.refreshAllFeed();
      showToast(Toast.Style.Success, "Feeds have been refreshed! (>ω^) ");
    } catch (error) {
      handleError(error as MinifluxApiError);
    }
  }, []);

  return (
    <ActionPanel title={entry.title}>
      <Action.Push title="Read the Original Content" target={<FeedInDetail entry={entry} />} icon={Icon.Glasses} />
      <Action
        onAction={() => handleBookmarkd(entry)}
        title={`${entry.starred ? "Unstar" : "Star"}`}
        icon={entry.starred ? Icon.StarDisabled : Icon.Star}
      />
      <Action.OpenInBrowser url={entry.url} title="Open in Browser with Original URL" />
      <Action.OpenInBrowser
        title="Open in Miniflux"
        shortcut={{ modifiers: ["opt"], key: "arrowDown" }}
        url={apiServer.getEntryUrlInMiniflux(entry)}
        icon={{ source: "miniflux-icon.png" }}
      />
      <Action onAction={hanleRefresh} title={"Fresh All Feeds"} icon={Icon.RotateClockwise} />
    </ActionPanel>
  );
};

export default ControlActions;
