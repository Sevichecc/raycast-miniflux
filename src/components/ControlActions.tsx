import { ActionPanel, Action } from "@raycast/api";
import { getEntryUrlInMiniflux } from "../utils/api";
import { MinifluxEntry } from "../utils/types";
import FeedInDetail from "./FeedInDetail";

const ControlActions = ({ entry }: { entry: MinifluxEntry }) => {

  return (
    <ActionPanel title={entry.title}>
      <Action.OpenInBrowser url={entry.url} />
      <Action.OpenInBrowser
        title="Open in Miniflux"
        shortcut={{ modifiers: ["opt"], key: "arrowDown" }}
        url={getEntryUrlInMiniflux(entry)}
      />
      <Action.Push title="Fetch Original Article and Read" target={<FeedInDetail entry={entry}/>} />
    </ActionPanel>
  );
};

export default ControlActions