import { List, showToast, Toast } from "@raycast/api";
import { getRecentEntries } from "./utils/api";
import { useEffect, useState } from "react";
import { MinifluxEntries, MinifluxApiError, State } from "./utils/types";
import ControlActions from "./components/ControlActions";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { useErrorHandler } from "./utils/useErrorHandler";

export default function getLatestFeed() {
  const [state, setState] = useState<State>({ isLoading: true });
  const handleError = useErrorHandler();
  const nhm = new NodeHtmlMarkdown();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showToast(Toast.Style.Animated, "Fetching latest articles");
        const entries: MinifluxEntries = await getRecentEntries();
        setState({ ...entries, isLoading: false });
        showToast(Toast.Style.Success, "Latest articles has been loaded");
      } catch (error) {
        handleError(error as MinifluxApiError);
        setState((oldState) => ({ ...oldState, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <List
      isShowingDetail
      isLoading={state.isLoading}
      throttle={true}
      navigationTitle="Search entries"
      searchBarPlaceholder="Search from your miniflux feeds"
    >
      {state.entries?.map((entry) => (
        <List.Item
          key={entry.id}
          title={entry.title}
          keywords={[...entry.title]}
          detail={
            <List.Item.Detail
              markdown={nhm.translate(`<h2>${entry.title}</h2>${entry.content}`)}
            />
          }
          actions={<ControlActions entry={entry} />}
        />
      ))}
    </List>
  );
}
