import { useEffect, useState } from "react";
import { Detail,showToast, Toast } from "@raycast/api";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { MinifluxEntry, MinifluxApiError,State } from "../utils/types";
import { getOriginArticle } from "../utils/api";
import { useErrorHandler } from "../utils/useErrorHandler";

const FeedInDetail = ({ entry }: { entry: MinifluxEntry }) => {
  const [state, setState] = useState<State>({ isLoading: true });
  const handleError = useErrorHandler();
  const nhm = new NodeHtmlMarkdown();
  const contentToRender = `<h2>${entry.title}</h2>` + state.origin?.content || entry.content;

  useEffect(() => {
    const fetchData = async () => {
      try {
        showToast(Toast.Style.Animated, "Fetching origial article")
        const origin = await getOriginArticle(entry);
        setState({ origin, isLoading: false });
        showToast(Toast.Style.Success, "Original article has been loaded");
      } catch (error) {
        handleError(error as MinifluxApiError);
        setState((oldState) => ({ ...oldState, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  return (<Detail isLoading={state.isLoading} markdown={nhm.translate(contentToRender)}  />);
};

export default FeedInDetail;
