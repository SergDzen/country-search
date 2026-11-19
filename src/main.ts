import { debounce } from "./utils/debounce.js";
import { createCountryCard } from "./components/CountryCard.js";
import { createSearchInput } from "./components/SearchInput.js";
import { searchCountries } from "./api/searchCountries.js";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

const heading = document.createElement("h1");
heading.textContent = "Country Search";

const searchInput = createSearchInput();

const results = document.createElement("section");

results.id = "search-results";
results.setAttribute("aria-label", "Search results");
results.setAttribute("aria-live", "polite");

app.append(heading, searchInput, results);

const handleSearch = debounce(async () => {
  const query = searchInput.value.trim();

  if (!query) {
    results.replaceChildren();
    return;
  }

  const controller = new AbortController();
  const countries = await searchCountries(query, controller.signal);

  const cards = countries.map(createCountryCard);
  results.replaceChildren(...cards);
}, 300);

searchInput.addEventListener("input", handleSearch);
