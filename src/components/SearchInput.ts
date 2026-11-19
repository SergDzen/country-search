export function createSearchInput(): HTMLInputElement {
  const input = document.createElement("input");

  input.type = "search";
  input.id = "country-search";
  input.placeholder = "Search for a country...";
  input.setAttribute("aria-label", "Search for a country");
  input.autocomplete = "off";

  return input;
}
