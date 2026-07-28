import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

function applyFilter(data, state) {
  return data.filter((row) => compare(row, state));
}

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    const selectElement = elements[elementName];
    if (!selectElement) return;

    const options = Object.values(indexes[elementName]).map((name) => {
      const option = document.createElement("option");
      option.textContent = name;
      option.value = name;
      return option;
    });

    selectElement.append(...options);
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action?.name === "clear") {
      const field = action.dataset?.field;
      if (!field) {
        console.warn("Field is not specified for clear action");
        return { data, state };
      }

      // Find input through button parent element
      const input = action.parentElement?.querySelector("input");
      if (!input) {
        console.warn(`Input element not found for field: ${field}`);
        return { data, state };
      }

      input.value = "";
      // Clear the corresponding field in state
      const newState = { ...state, [field]: "" };

      return {
        data: applyFilter(data, newState),
        state: newState,
      };
    }

    return {
      data: applyFilter(data, state),
      state,
    };
  };
}
