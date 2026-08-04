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

  return (data, state) => {
    // @todo: #5.2 — применить компаратор
    const searchValue = state[searchField] ?? "";
    if (!searchValue.trim()) {
      return data;
    }
    return data.filter(row => compare(row, state));
  };
}
