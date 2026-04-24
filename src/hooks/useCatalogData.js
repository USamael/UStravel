import { useState } from "react";
import {
  DEFAULT_CATALOG,
  createCatalogHelpers,
  fetchCatalogCountries,
  fetchCitiesForCountry,
  setCitiesForCountry
} from "../utils/travel";

export function useCatalogData() {
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [catalogStatus, setCatalogStatus] = useState("idle");

  async function ensureCatalogLoaded(countryCode = "") {
    let nextCatalog = catalog;

    if (catalogStatus !== "loaded") {
      if (catalogStatus === "loading") {
        return catalog;
      }

      setCatalogStatus("loading");

      try {
        const countries = await fetchCatalogCountries();
        nextCatalog = createCatalogHelpers(countries);
        setCatalog(nextCatalog);
        setCatalogStatus("loaded");
      } catch {
        setCatalogStatus("error");
        return catalog;
      }
    }

    if (!countryCode) {
      return nextCatalog;
    }

    if (
      nextCatalog.cityCache.has(countryCode) ||
      nextCatalog.cityLoadStatus.get(countryCode) === "loading"
    ) {
      return nextCatalog;
    }

    setCatalog((current) => {
      const nextState = {
        ...current,
        cityCache: new Map(current.cityCache),
        cityLoadStatus: new Map(current.cityLoadStatus)
      };
      nextState.cityLoadStatus.set(countryCode, "loading");
      return nextState;
    });

    try {
      const cities = await fetchCitiesForCountry(countryCode);
      const updatedCatalog = setCitiesForCountry(countryCode, cities, nextCatalog);
      setCatalog(updatedCatalog);
      return updatedCatalog;
    } catch {
      setCatalog((current) => {
        const nextState = {
          ...current,
          cityCache: new Map(current.cityCache),
          cityLoadStatus: new Map(current.cityLoadStatus)
        };
        nextState.cityLoadStatus.set(countryCode, "error");
        return nextState;
      });
    }

    return nextCatalog;
  }

  return {
    catalog,
    catalogStatus,
    ensureCatalogLoaded,
    setCatalog
  };
}
