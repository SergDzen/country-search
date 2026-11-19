import { showCountryDetails } from "./CountryDetails.js";
import type { Country } from "../types/country.js";

export function createCountryCard(country: Country): HTMLElement {
  const card = document.createElement("article");
  card.className = "country-card";

  const flag = document.createElement("img");
  flag.src = country.flagUrl;
  flag.alt = `Flag of ${country.name}`;
  flag.className = "country-card__flag";
  flag.loading = "lazy";

  const title = document.createElement("h2");
  title.textContent = country.name;

  const capital = document.createElement("p");
  capital.textContent = `Capital: ${country.capital}`;

  const region = document.createElement("p");
  region.textContent = `Region: ${country.region}`;

  const population = document.createElement("p");
  population.textContent = `Population: ${country.population.toLocaleString("en-US")}`;

  card.append(flag, title, capital, region, population);

  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View details for ${country.name}`);

  card.addEventListener("click", () => {
    showCountryDetails(country);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showCountryDetails(country);
    }
  });

  return card;
}
