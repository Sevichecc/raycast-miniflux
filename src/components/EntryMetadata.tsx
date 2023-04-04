import { List, Icon } from "@raycast/api";
import { MinifluxEntry } from "../utils/types";
  
const EntryMetadata = ({ entry }: { entry: MinifluxEntry }) => {
  return (
    <List.Item.Detail.Metadata>
      <List.Item.Detail.Metadata.Label title="Author" text={entry.author} icon={Icon.Person} />
      <List.Item.Detail.Metadata.Link title="Feed" target={entry.feed.feed_url} text={entry.feed.title} />
      <List.Item.Detail.Metadata.TagList title="Category">
        <List.Item.Detail.Metadata.TagList.Item text={entry.feed.category.title} />
      </List.Item.Detail.Metadata.TagList>
    </List.Item.Detail.Metadata>
  );
};

export default EntryMetadata;
