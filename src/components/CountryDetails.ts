import type { Country } from "../types/country.js";

export function showCountryDetails(country: Country): void {
  const dialog = document.createElement("dialog");
  dialog.className = "country-details";

  const content = document.createElement("div");
  content.className = "country-details__content";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "country-details__close";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Close country details");

  const title = document.createElement("h2");
  title.textContent = country.name;
  title.id = "country-details-title";

  dialog.setAttribute("aria-labelledby", title.id);

  const flag = document.createElement("img");
  flag.src = country.flagUrl;
  flag.alt = `Flag of ${country.name}`;
  flag.className = "country-details__flag";

  const description = document.createElement("p");
  description.textContent = `${country.name} is a country in ${country.subregion || country.region}.`;

  const details = document.createElement("div");
  details.className = "country-details__info";

  const fields: [string, string][] = [
    ["Capital", country.capital],
    ["Region", country.region],
    ["Area", `${country.area.toLocaleString("en-US")} km²`],
    ["Population", country.population.toLocaleString("en-US")],
    ["Borders", country.borders.join(", ") || "None"],
    ["Languages", country.languages.join(", ") || "Unknown"],
    [
      "Currencies",
      country.currencies
        .map((currency) => `${currency.name} (${currency.code})`)
        .join(", ") || "Unknown",
    ],
  ];

  for (const [label, value] of fields) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(value));

    details.append(paragraph);
  }

  content.append(closeButton, title, flag, description, details);
  dialog.append(content);
  document.body.append(dialog);

  const closeDialog = (): void => {
    dialog.close();
  };

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener(
    "close",
    () => {
      dialog.remove();
    },
    { once: true },
  );

  dialog.showModal();
  closeButton.focus();
}
