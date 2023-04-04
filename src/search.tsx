import { List, ActionPanel, Action } from "@raycast/api";
import { useState } from "react";
import { MinifluxEntry } from "./utils/types";
import { getEntryUrlInMiniflux } from "./utils/apis";
import { useEntryIcon } from "./utils/useEntryIcon";
import { useSearchEntries } from "./utils/useSearchEntries";

const EntryListItem = ({ entry }: { entry: MinifluxEntry }) => {
  const icon = useEntryIcon(entry);

  return (
    <List.Item
      key={entry.id}
      title={entry.title}
      keywords={[...entry.title]}
      icon={icon}
      accessories={[{text: entry.author}]}
      actions={
        <ActionPanel title={entry.title}>
          <Action.OpenInBrowser url={entry.url} />
          <Action.OpenInBrowser
            title="Open in Miniflux"
            shortcut={{ modifiers: ["opt"], key: "arrowDown" }}
            url={getEntryUrlInMiniflux(entry)}
          />
        </ActionPanel>
      }
    />
  );
};

type FilterDropdownProps = {
  handleFilter: (value: string) => void;
};

const FilterDropdown = ({ handleFilter }: FilterDropdownProps) => {
  return (
    <List.Dropdown storeValue={true} tooltip="Filter by entry status" defaultValue="all" onChange={handleFilter}>
      {FILTER_OPTIONS.map((option) => (
        <List.Dropdown.Item key={option.value} title={option.title} value={option.value} />
      ))}
    </List.Dropdown>
  );
};

const FILTER_OPTIONS = [
  { title: "All", value: "all" },
  { title: "Unread", value: "unread" },
  { title: "Read", value: "read" },
  { title: "Starred", value: "starred" },
];

export default function SearchEntries() {
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const state = useSearchEntries(searchText);

  const handleFilter = (value: string) => {
    setFilterValue(value);
  };

  const filteredEntries = () => {
    if (filterValue === "starred") {
      return state.entries?.filter((entry) => entry.starred === true) || [];
    }
    return state.entries?.filter((entry) => filterValue === "all" || entry.status === filterValue) || [];
  };

  return (
    <>
      <List
        isLoading={state.isLoading}
        onSearchTextChange={setSearchText}
        throttle={true}
        navigationTitle="Search entries"
        searchBarPlaceholder="Search from your miniflux feeds"
        searchBarAccessory={<FilterDropdown handleFilter={handleFilter} />}
      >
        {filteredEntries().map((entry) => (
          <EntryListItem key={entry.id} entry={entry} />
        ))}
      </List>
    </>
  );
}
