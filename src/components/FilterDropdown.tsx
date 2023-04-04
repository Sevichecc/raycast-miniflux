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
    <List.Dropdown storeValue={false} tooltip="Filter by article status" defaultValue="all" onChange={handleFilter}>
      {FILTER_OPTIONS.map(({ value, title }) => (
        <List.Dropdown.Item key={value} title={title} value={value} />
      ))}
    </List.Dropdown>
  );
};

export default FilterDropdown;
