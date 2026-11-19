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

let activeController: AbortController | null = null;

const handleSearch = debounce(async () => {
  const query = searchInput.value.trim();

  if (!query) {
    results.replaceChildren();
    return;
  }

  activeController?.abort();

  const controller = new AbortController();
  activeController = controller;
  results.textContent = "Loading...";
  try {
    const countries = await searchCountries(query, controller.signal);

    if (controller.signal.aborted) {
      return;
    }

    if (countries.length === 0) {
      results.textContent = "No countries found";
      return;
    }

    const cards = countries.map(createCountryCard);
    results.replaceChildren(...cards);
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    console.error("Failed to search countries:", error);
    results.textContent = "Something went wrong. Please try again.";
  }
}, 300);

searchInput.addEventListener("input", () => {
  activeController?.abort();
  handleSearch();
});
