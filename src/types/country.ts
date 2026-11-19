export interface CountryLanguage {
  name: string;
  iso639_1: string;
  iso639_2: string;
  nativeName: string;
}

export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryFlags {
  png: string;
  svg: string;
}

export interface CountryResponse {
  area: number;
  cioc: string;
  flag: string;
  gini: number;
  name: string;
  flags: CountryFlags;
  latlng: number[];
  region: string;
  borders: string[];
  capital: string;
  demonym: string;
  languages: CountryLanguage[];
  subregion: string;
  timezones: string[];
  alpha2Code: string;
  alpha3Code: string;
  currencies: CountryCurrency[];
  nativeName: string;
  population: number;
  independent: boolean;
  numericCode: string;
  callingCodes: string[];
  topLevelDomain: string[];
  populationDensity: number;
}

export interface Country {
  name: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  flagUrl: string;
  borders: string[];
  languages: string[];
  currencies: CountryCurrency[];
}
