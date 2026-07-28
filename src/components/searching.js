import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const compare = createComparison(
    ["skipEmptyTargetValues"],
    [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller"],
        false,
      ),
    ],
  );

  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    const searchValue = state[searchField] ?? "";
    if (!searchValue) {
      return { data, state };
    }

    // Filter data through our own comparator
    const filteredData = data.filter((row) => compare(row, state));
    return { data: filteredData, state };
  };
}
