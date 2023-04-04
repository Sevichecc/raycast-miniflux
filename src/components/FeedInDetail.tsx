import { useEffect, useState } from "react";
import { Detail } from "@raycast/api";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { MinifluxEntry, MinifluxApiError,State } from "../utils/types";
import { fetchOriginArticle } from "../utils/api";
import { useErrorHandler } from "../utils/useErrorHandler";

const FeedInDetail = ({ entry }: { entry: MinifluxEntry }) => {
  const [state, setState] = useState<State>({ isLoading: true });
  const handleError = useErrorHandler();
  const nhm = new NodeHtmlMarkdown();
  const contentToRender = state.origin?.content || entry.content;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const origin = await fetchOriginArticle(entry);
        setState({ origin, isLoading: false });
      } catch (error) {
        handleError(error as MinifluxApiError);
        setState((oldState) => ({ ...oldState, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  return <Detail isLoading={state.isLoading} markdown={nhm.translate(contentToRender)} />;
};

export default FeedInDetail;
