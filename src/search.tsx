import { List } from "@raycast/api";
import { useState } from "react";
import { useSearchEntries } from "./utils/useSearchEntries";
import EntryListItem from "./components/EntryListItem";
import FilterDropdown from "./components/FilterDropdown";

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
