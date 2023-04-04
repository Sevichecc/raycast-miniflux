import { List } from "@raycast/api";

const FILTER_OPTIONS = [
  { title: "All", value: "all" },
  { title: "Unread", value: "unread" },
  { title: "Read", value: "read" },
  { title: "Starred", value: "starred" },
];

type FilterDropdownProps = {
  handleFilter: (value: string) => void;
};

const FilterDropdown = ({ handleFilter }: FilterDropdownProps) => {
  return (
    <List.Dropdown storeValue={false} tooltip="Filter by entry status" defaultValue="all" onChange={handleFilter}>
      {FILTER_OPTIONS.map((option) => (
        <List.Dropdown.Item key={option.value} title={option.title} value={option.value} />
      ))}
    </List.Dropdown>
  );
};

export default FilterDropdown;
