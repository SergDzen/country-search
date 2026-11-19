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

const showError = (): void => {
  const message = document.createElement("p");
  message.textContent = "Something went wrong. Please try again.";

  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.textContent = "Retry";

  retryButton.addEventListener("click", () => {
    void executeSearch();
  });

  results.replaceChildren(message, retryButton);
};

const executeSearch = async (): Promise<void> => {
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
    if (
      controller.signal.aborted &&
      controller.signal.reason?.name !== "TimeoutError"
    ) {
      return;
    }

    console.error("Failed to search countries:", error);
    showError();
  }
};

const handleSearch = debounce(executeSearch, 300);

searchInput.addEventListener("input", () => {
  activeController?.abort();
  handleSearch();
});
