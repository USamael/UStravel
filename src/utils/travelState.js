import { groupCitiesByCountry, normalizeTravelState } from "./travel.js";

export function exportTravelPayload(travelState, exportedAt = new Date().toISOString()) {
  return {
    exportedAt,
    data: travelState
  };
}

export function importTravelPayload(serializedPayload, catalog) {
  const parsed = typeof serializedPayload === "string" ? JSON.parse(serializedPayload) : serializedPayload;
  return normalizeTravelState(parsed.data || parsed, catalog);
}

export function upsertCityInState(currentState, cityPayload, createdOriginCity = null) {
  const hasExistingCity = currentState.cities.some((city) => city.id === cityPayload.id);
  let nextCities = hasExistingCity
    ? currentState.cities.map((city) => (city.id === cityPayload.id ? cityPayload : city))
    : [...currentState.cities, cityPayload];

  if (createdOriginCity) {
    nextCities = [...nextCities, createdOriginCity];
  }

  return {
    ...currentState,
    cities: nextCities
  };
}

export function deleteCityFromState(currentState, cityId) {
  return {
    ...currentState,
    cities: currentState.cities
      .filter((city) => city.id !== cityId)
      .map((city) => ({
        ...city,
        fromCityId: city.fromCityId === cityId ? "" : city.fromCityId
      }))
  };
}

export function renameCountryInState(currentState, previousCountryName, nextCountryName, nextCountryCode = "") {
  const nextCountryNotes = { ...currentState.countryNotes };
  const carriedNote = nextCountryNotes[previousCountryName] || "";

  delete nextCountryNotes[previousCountryName];
  nextCountryNotes[nextCountryName] = carriedNote;

  return {
    ...currentState,
    cities: currentState.cities.map((city) =>
      city.country === previousCountryName
        ? {
            ...city,
            country: nextCountryName,
            countryCode: nextCountryCode || city.countryCode || ""
          }
        : city
    ),
    countryNotes: nextCountryNotes
  };
}

export function saveCityNote(currentState, cityId, nextNote) {
  return {
    ...currentState,
    cities: currentState.cities.map((city) => (city.id === cityId ? { ...city, note: nextNote } : city))
  };
}

export function saveCountryNote(currentState, countryName, nextNote) {
  return {
    ...currentState,
    countryNotes: {
      ...currentState.countryNotes,
      [countryName]: nextNote
    }
  };
}

export function deleteCountryFromState(currentState, countryName) {
  return {
    ...currentState,
    cities: currentState.cities.filter((city) => city.country !== countryName),
    countryNotes: Object.fromEntries(
      Object.entries(currentState.countryNotes).filter(([key]) => key !== countryName)
    )
  };
}

export function upsertWishlistEntry(currentState, wishlistPayload) {
  const hasExistingEntry = currentState.wishlist.some((entry) => entry.id === wishlistPayload.id);

  return {
    ...currentState,
    wishlist: hasExistingEntry
      ? currentState.wishlist.map((entry) => (entry.id === wishlistPayload.id ? wishlistPayload : entry))
      : [...currentState.wishlist, wishlistPayload]
  };
}

export function deleteWishlistEntry(currentState, entryId) {
  return {
    ...currentState,
    wishlist: currentState.wishlist.filter((entry) => entry.id !== entryId)
  };
}

export function addPhotosToCity(currentState, cityId, photos) {
  return {
    ...currentState,
    cities: currentState.cities.map((city) =>
      city.id === cityId
        ? { ...city, photos: [...(city.photos || []), ...photos].slice(0, 6) }
        : city
    )
  };
}

export function deletePhotoFromCity(currentState, cityId, photoId) {
  return {
    ...currentState,
    cities: currentState.cities.map((city) =>
      city.id === cityId
        ? { ...city, photos: (city.photos || []).filter((photo) => photo.id !== photoId) }
        : city
    )
  };
}

export function firstOpenCountry(state) {
  return Object.keys(groupCitiesByCountry(state.cities))[0] || "";
}
