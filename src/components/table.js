import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    before.reverse().forEach(subName => {
      root[subName] = cloneTemplate(subName);
      root.container.prepend(root[subName].container);
    });

    after.reverse().forEach(subName => {
      root[subName] = cloneTemplate(subName);
      root.container.append(root[subName].container);
    });

    root.container.addEventListener("change", onAction());
    root.container.addEventListener("reset", () => setTimeout(onAction));
    root.container.addEventListener("submit", (e) => {
      e.preventDefault();
      onAction(e.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
          const row = cloneTemplate(rowTemplate);
          const elements = row.elements;

          for (const key in item) {
            if (!Object.prototype.hasOwnProperty.call(elements, key)) continue;

            const el = elements[key];
            const value = item[key];

            if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
              el.value = value;
            } else {
              el.textContent = value;
            }
          }

          return row;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}
