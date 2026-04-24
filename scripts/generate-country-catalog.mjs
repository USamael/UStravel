import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { City, Country } from "country-state-city";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const catalogRoot = path.join(projectRoot, "public", "catalog");
const cityCatalogRoot = path.join(catalogRoot, "cities");

function simplifyCountry(country) {
  return {
    name: country.name,
    isoCode: country.isoCode
  };
}

function simplifyCity(city) {
  return {
    name: city.name,
    countryCode: city.countryCode,
    stateCode: city.stateCode || "",
    latitude: Number(city.latitude),
    longitude: Number(city.longitude)
  };
}

async function main() {
  await mkdir(cityCatalogRoot, { recursive: true });

  const countries = Country.getAllCountries()
    .map(simplifyCountry)
    .sort((left, right) => left.name.localeCompare(right.name, "en"));

  await writeFile(
    path.join(catalogRoot, "countries.json"),
    `${JSON.stringify(countries)}\n`
  );

  await Promise.all(
    countries.map(async (country) => {
      const cities = City.getCitiesOfCountry(country.isoCode)
        .map(simplifyCity)
        .sort((left, right) => left.name.localeCompare(right.name, "en"));

      await writeFile(
        path.join(cityCatalogRoot, `${country.isoCode}.json`),
        `${JSON.stringify(cities)}\n`
      );
    })
  );

  console.log(`Catalog generated for ${countries.length} countries in ${catalogRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
