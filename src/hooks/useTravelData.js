import { useEffect, useMemo, useState } from "react";
import { useCatalogData } from "./useCatalogData";
import { useTravelForms } from "./useTravelForms";
import { useTravelStore } from "./useTravelStore";
import {
  ESTIMATED_WORLD_CITY_AREAS,
  ESTIMATED_WORLD_COUNTRIES,
  buildArcPoints,
  calculateDuration,
  calculateTotalTravelDays,
  demoTravelState,
  getCitiesForCountry,
  getCountryByName,
  groupCitiesByCountry,
  haversineDistance,
  normalizeText,
  normalizeTravelState
} from "../utils/travel";
import {
  addPhotosToCity,
  deleteCityFromState,
  deleteCountryFromState,
  deletePhotoFromCity,
  deleteWishlistEntry,
  exportTravelPayload,
  firstOpenCountry,
  importTravelPayload,
  renameCountryInState,
  saveCityNote,
  saveCountryNote,
  upsertCityInState,
  upsertWishlistEntry
} from "../utils/travelState";

export function useTravelData() {
  const { catalog, catalogStatus, ensureCatalogLoaded } = useCatalogData();
  const {
    activeNotePanel,
    openCountry,
    setActiveNotePanel,
    setOpenCountry,
    setStorageStatus,
    setTravelState,
    storageStatus,
    travelState
  } = useTravelStore();
  const {
    cityCountryQuery,
    cityDraft,
    cityQuery,
    countryNameDraft,
    originCityQuery,
    originCountryQuery,
    originDraft,
    resetCityDraft,
    resetWishlistDraft,
    searchQuery,
    setCityCountryQuery,
    setCityDraft,
    setCityQuery,
    setCountryNameDraft,
    setOriginCityQuery,
    setOriginCountryQuery,
    setOriginDraft,
    setSearchQuery,
    setWishlistCountryQuery,
    setWishlistDraft,
    wishlistCountryQuery,
    wishlistDraft
  } = useTravelForms();
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [mapStyle, setMapStyle] = useState("dark");
  const [globeTheme, setGlobeTheme] = useState("colorful");
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (!selectedLatLng) {
      return;
    }

    setCityDraft((current) => ({
      ...current,
      lat: selectedLatLng.lat.toFixed(4),
      lng: selectedLatLng.lng.toFixed(4)
    }));
  }, [selectedLatLng, setCityDraft]);

  useEffect(() => {
    if (cityDraft.arrivalDate && cityDraft.departureDate && cityDraft.departureDate < cityDraft.arrivalDate) {
      setCityDraft((current) => ({
        ...current,
        departureDate: current.arrivalDate
      }));
    }
  }, [cityDraft.arrivalDate, cityDraft.departureDate, setCityDraft]);

  useEffect(() => {
    if (activeNotePanel?.type === "country") {
      setCountryNameDraft(activeNotePanel.country);
      return;
    }

    if (activeNotePanel?.type === "city") {
      const selectedCity = travelState.cities.find((city) => city.id === activeNotePanel.id);
      setCountryNameDraft(selectedCity?.country || "");
      return;
    }

    setCountryNameDraft("");
  }, [activeNotePanel, setCountryNameDraft, travelState.cities]);

  const normalizedSearchQuery = useMemo(() => normalizeText(searchQuery), [searchQuery]);
  const normalizedCityCountryQuery = useMemo(() => normalizeText(cityCountryQuery), [cityCountryQuery]);
  const normalizedCityQuery = useMemo(() => normalizeText(cityQuery), [cityQuery]);
  const normalizedOriginCountryQuery = useMemo(() => normalizeText(originCountryQuery), [originCountryQuery]);
  const normalizedOriginCityQuery = useMemo(() => normalizeText(originCityQuery), [originCityQuery]);
  const normalizedWishlistCountryQuery = useMemo(() => normalizeText(wishlistCountryQuery), [wishlistCountryQuery]);

  const groupedCountries = useMemo(() => groupCitiesByCountry(travelState.cities), [travelState.cities]);
  const citiesById = useMemo(
    () => new Map(travelState.cities.map((city) => [city.id, city])),
    [travelState.cities]
  );
  const countryNames = useMemo(
    () => Object.keys(groupedCountries).sort((left, right) => left.localeCompare(right)),
    [groupedCountries]
  );
  const totalCountries = countryNames.length;
  const totalCities = travelState.cities.length;
  const sortedWishlist = useMemo(
    () => [...travelState.wishlist].sort((left, right) => left.rank - right.rank),
    [travelState.wishlist]
  );
  const visitedCountryCodes = useMemo(
    () =>
      countryNames
        .map((countryName) => catalog.countriesByName.get(countryName.trim().toLowerCase())?.isoCode)
        .filter(Boolean),
    [catalog.countriesByName, countryNames]
  );
  const worldPercent = useMemo(
    () => Math.min(100, (totalCountries / ESTIMATED_WORLD_COUNTRIES) * 100),
    [totalCountries]
  );
  const citySurfacePercent = useMemo(
    () => Math.min(100, (totalCities / ESTIMATED_WORLD_CITY_AREAS) * 100),
    [totalCities]
  );
  const totalTravelDays = useMemo(() => calculateTotalTravelDays(travelState.cities), [travelState.cities]);
  const cityDraftDuration = calculateDuration(cityDraft.arrivalDate, cityDraft.departureDate);

  const searchedCityResults = useMemo(
    () =>
      travelState.cities.filter((city) => normalizeText(`${city.name} ${city.country}`).includes(normalizedSearchQuery)),
    [normalizedSearchQuery, travelState.cities]
  );

  const cityCountryOptions = useMemo(
    () =>
      catalog.allCountries
        .filter((country) => normalizeText(country.name).includes(normalizedCityCountryQuery))
        .map((country) => ({
          key: country.isoCode,
          title: country.name,
          subtitle: country.isoCode,
          value: country
        })),
    [catalog.allCountries, normalizedCityCountryQuery]
  );

  const wishlistCountryOptions = useMemo(
    () =>
      catalog.allCountries
        .filter((country) => normalizeText(country.name).includes(normalizedWishlistCountryQuery))
        .map((country) => ({
          key: `wishlist-${country.isoCode}`,
          title: country.name,
          subtitle: country.isoCode,
          value: country
        })),
    [catalog.allCountries, normalizedWishlistCountryQuery]
  );

  const cityOptions = useMemo(
    () =>
      getCitiesForCountry(cityDraft.countryCode, catalog)
        .filter((city) => normalizeText(city.name).includes(normalizedCityQuery))
        .map((city) => ({
          key: `${city.countryCode}-${city.stateCode}-${city.name}-${city.latitude}-${city.longitude}`,
          title: city.name,
          subtitle: `${city.stateCode || "Sehir"} • ${Number(city.latitude).toFixed(2)}, ${Number(city.longitude).toFixed(2)}`,
          value: city
        })),
    [catalog, cityDraft.countryCode, normalizedCityQuery]
  );

  const originCountryOptions = useMemo(
    () =>
      catalog.allCountries
        .filter((country) => normalizeText(country.name).includes(normalizedOriginCountryQuery))
        .map((country) => ({
          key: `origin-${country.isoCode}`,
          title: country.name,
          subtitle: country.isoCode,
          value: country
        })),
    [catalog.allCountries, normalizedOriginCountryQuery]
  );

  const originCityOptions = useMemo(
    () =>
      getCitiesForCountry(originDraft.countryCode, catalog)
        .filter((city) => normalizeText(city.name).includes(normalizedOriginCityQuery))
        .map((city) => ({
          key: `origin-${city.countryCode}-${city.stateCode}-${city.name}-${city.latitude}-${city.longitude}`,
          title: city.name,
          subtitle: `${city.stateCode || "Sehir"} • ${Number(city.latitude).toFixed(2)}, ${Number(city.longitude).toFixed(2)}`,
          value: city
        })),
    [catalog, normalizedOriginCityQuery, originDraft.countryCode]
  );

  const arcSets = useMemo(() => {
    const nextArcSets = [];

    for (const city of travelState.cities) {
      const originCity = citiesById.get(city.fromCityId);

      if (!originCity) {
        continue;
      }

      nextArcSets.push({
        key: `${originCity.id}-${city.id}`,
        points: buildArcPoints(originCity, city),
        distanceKm: haversineDistance(originCity, city)
      });
    }

    return nextArcSets;
  }, [citiesById, travelState.cities]);

  const totalRouteDistance = useMemo(
    () => arcSets.reduce((total, arc) => total + arc.distanceKm, 0),
    [arcSets]
  );

  const activeCity = useMemo(
    () => (activeNotePanel?.type === "city" ? citiesById.get(activeNotePanel.id) || null : null),
    [activeNotePanel, citiesById]
  );

  const activeCountry =
    activeNotePanel?.type === "country" ? activeNotePanel.country : activeCity?.country || null;
  const activeOriginCityName = activeCity?.fromCityId ? citiesById.get(activeCity.fromCityId)?.name || "" : "";

  async function ensureCitiesLoaded(countryCode) {
    if (!countryCode) {
      return;
    }

    const nextCatalog = await ensureCatalogLoaded(countryCode);
    setTravelState((current) => normalizeTravelState(current, nextCatalog));
  }

  function resetCityForm() {
    resetCityDraft(selectedLatLng);
  }

  function handleCityCountrySelect(option) {
    const country = option.value;

    setCityDraft((current) => ({
      ...current,
      country: country.name,
      countryCode: country.isoCode,
      name: "",
      fromCityId: current.fromCityId,
      lat: selectedLatLng ? selectedLatLng.lat.toFixed(4) : "",
      lng: selectedLatLng ? selectedLatLng.lng.toFixed(4) : ""
    }));
    setCityCountryQuery(country.name);
    setCityQuery("");
    ensureCitiesLoaded(country.isoCode);
  }

  function handleCitySelect(option) {
    const city = option.value;
    const country = catalog.countriesByCode.get(city.countryCode);
    const lat = Number(city.latitude);
    const lng = Number(city.longitude);

    setCityDraft((current) => ({
      ...current,
      name: city.name,
      country: country?.name || current.country,
      countryCode: city.countryCode,
      fromCityId: current.fromCityId,
      lat: lat.toFixed(4),
      lng: lng.toFixed(4)
    }));
    setCityCountryQuery(country?.name || cityDraft.country);
    setCityQuery(city.name);
    setSelectedLatLng({ lat, lng });
  }

  function handleCitySubmit(event) {
    event.preventDefault();

    if (!cityDraft.name.trim() || !cityDraft.country.trim() || !cityDraft.lat || !cityDraft.lng) {
      return;
    }

    let resolvedFromCityId = cityDraft.fromCityId || "";

    const matchedExistingOrigin = travelState.cities.find(
      (city) =>
        city.id !== cityDraft.id &&
        city.name === originDraft.name &&
        city.country === originDraft.country &&
        Number(city.lat).toFixed(4) === Number(originDraft.lat || 0).toFixed(4) &&
        Number(city.lng).toFixed(4) === Number(originDraft.lng || 0).toFixed(4)
    );

    const shouldCreateOrigin =
      !resolvedFromCityId &&
      originDraft.name.trim() &&
      originDraft.country.trim() &&
      originDraft.lat &&
      originDraft.lng;

    let createdOriginCity = null;

    if (matchedExistingOrigin) {
      resolvedFromCityId = matchedExistingOrigin.id;
    } else if (shouldCreateOrigin) {
      createdOriginCity = {
        id: crypto.randomUUID(),
        name: originDraft.name.trim(),
        country: originDraft.country.trim(),
        countryCode: originDraft.countryCode || getCountryByName(originDraft.country, catalog)?.isoCode || "",
        fromCityId: "",
        lat: Number(originDraft.lat),
        lng: Number(originDraft.lng),
        arrivalDate: "",
        departureDate: "",
        note: ""
      };
      resolvedFromCityId = createdOriginCity.id;
    }

    const cityPayload = {
      id: cityDraft.id || crypto.randomUUID(),
      name: cityDraft.name.trim(),
      country: cityDraft.country.trim(),
      countryCode: cityDraft.countryCode || getCountryByName(cityDraft.country, catalog)?.isoCode || "",
      fromCityId: resolvedFromCityId,
      lat: Number(cityDraft.lat),
      lng: Number(cityDraft.lng),
      arrivalDate: cityDraft.arrivalDate,
      departureDate: cityDraft.departureDate,
      note: cityDraft.note.trim(),
      photos: activeCity?.photos || []
    };

    setTravelState((current) => upsertCityInState(current, cityPayload, createdOriginCity));
    setOpenCountry(cityPayload.country);
    setActiveNotePanel({ type: "city", id: cityPayload.id });
    resetCityForm();
  }

  function handleEditCity(city) {
    const originCity = citiesById.get(city.fromCityId);

    setCityDraft({
      id: city.id,
      name: city.name,
      country: city.country,
      countryCode: city.countryCode || getCountryByName(city.country, catalog)?.isoCode || "",
      fromCityId: city.fromCityId || "",
      lat: String(city.lat),
      lng: String(city.lng),
      arrivalDate: city.arrivalDate || "",
      departureDate: city.departureDate || "",
      note: city.note || ""
    });
    setCityCountryQuery(city.country);
    setCityQuery(city.name);
    setOriginDraft({
      country: originCity?.country || "",
      countryCode: originCity?.countryCode || getCountryByName(originCity?.country || "", catalog)?.isoCode || "",
      name: originCity?.name || "",
      lat: originCity ? String(originCity.lat) : "",
      lng: originCity ? String(originCity.lng) : ""
    });
    setOriginCountryQuery(originCity?.country || "");
    setOriginCityQuery(originCity?.name || "");
    setSelectedLatLng({ lat: city.lat, lng: city.lng });
  }

  function handleOriginCountrySelect(option) {
    const country = option.value;

    setCityDraft((current) => ({
      ...current,
      fromCityId: ""
    }));
    setOriginDraft({
      country: country.name,
      countryCode: country.isoCode,
      name: "",
      lat: "",
      lng: ""
    });
    setOriginCountryQuery(country.name);
    setOriginCityQuery("");
    ensureCitiesLoaded(country.isoCode);
  }

  function handleOriginCitySelect(option) {
    const city = option.value;
    const country = catalog.countriesByCode.get(city.countryCode);
    const lat = Number(city.latitude);
    const lng = Number(city.longitude);
    const matchedExistingOrigin = travelState.cities.find(
      (candidate) =>
        candidate.id !== cityDraft.id &&
        candidate.name === city.name &&
        candidate.countryCode === city.countryCode &&
        Number(candidate.lat).toFixed(4) === lat.toFixed(4) &&
        Number(candidate.lng).toFixed(4) === lng.toFixed(4)
    );

    setOriginDraft({
      country: country?.name || "",
      countryCode: city.countryCode,
      name: city.name,
      lat: lat.toFixed(4),
      lng: lng.toFixed(4)
    });
    setOriginCountryQuery(country?.name || "");
    setOriginCityQuery(city.name);
    setCityDraft((current) => ({
      ...current,
      fromCityId: matchedExistingOrigin?.id || ""
    }));
  }

  function handleDeleteCity(cityId) {
    setTravelState((current) => deleteCityFromState(current, cityId));
    setActiveNotePanel((current) => {
      if (current?.type === "city" && current.id === cityId) {
        return null;
      }

      return current;
    });
  }

  function handleCityNoteSave(cityId, nextNote) {
    setTravelState((current) => saveCityNote(current, cityId, nextNote));
  }

  function handleCountryNoteSave(countryName, nextNote) {
    setTravelState((current) => saveCountryNote(current, countryName, nextNote));
  }

  function handleDeleteCountry(countryName) {
    setTravelState((current) => deleteCountryFromState(current, countryName));
    setActiveNotePanel((current) => {
      if (current?.type === "country" && current.country === countryName) {
        return null;
      }

      return current;
    });
  }

  function handleCountryRename(previousCountryName) {
    const nextCountryName = countryNameDraft.trim();
    const matchedCountry = getCountryByName(nextCountryName, catalog);

    if (!previousCountryName || !nextCountryName || nextCountryName === previousCountryName) {
      return;
    }

    setTravelState((current) =>
      renameCountryInState(current, previousCountryName, nextCountryName, matchedCountry?.isoCode || "")
    );

    setOpenCountry(nextCountryName);
    setActiveNotePanel({ type: "country", country: nextCountryName });
  }

  function handleWishlistCountrySelect(option) {
    const country = option.value;

    setWishlistDraft((current) => ({
      ...current,
      country: country.name,
      countryCode: country.isoCode
    }));
    setWishlistCountryQuery(country.name);
  }

  function handleWishlistSubmit(event) {
    event.preventDefault();

    if (!wishlistDraft.country.trim() || !wishlistDraft.rank) {
      return;
    }

    const wishlistPayload = {
      id: wishlistDraft.id || crypto.randomUUID(),
      country: wishlistDraft.country.trim(),
      countryCode: wishlistDraft.countryCode || getCountryByName(wishlistDraft.country, catalog)?.isoCode || "",
      rank: Number(wishlistDraft.rank),
      note: wishlistDraft.note.trim()
    };

    setTravelState((current) => upsertWishlistEntry(current, wishlistPayload));
    resetWishlistDraft();
  }

  function handleWishlistEdit(entry) {
    setWishlistDraft({
      id: entry.id,
      country: entry.country,
      countryCode: entry.countryCode || getCountryByName(entry.country, catalog)?.isoCode || "",
      rank: String(entry.rank),
      note: entry.note || ""
    });
    setWishlistCountryQuery(entry.country);
  }

  function handleWishlistDelete(entryId) {
    setTravelState((current) => deleteWishlistEntry(current, entryId));
  }

  function handleQuickWishlistAdd(country, reason = "") {
    if (!country?.name) {
      return;
    }

    const highestRank = travelState.wishlist.reduce((max, entry) => Math.max(max, Number(entry.rank) || 0), 0);

    setTravelState((current) =>
      upsertWishlistEntry(current, {
        id:
          current.wishlist.find((entry) => entry.countryCode === country.code || entry.country === country.name)?.id ||
          crypto.randomUUID(),
        country: country.name,
        countryCode: country.code,
        rank:
          current.wishlist.find((entry) => entry.countryCode === country.code || entry.country === country.name)?.rank ||
          highestRank + 1,
        note: reason
      })
    );
    setWishlistDraft({
      id: null,
      country: country.name,
      countryCode: country.code,
      rank: String(highestRank + 1),
      note: reason
    });
    setWishlistCountryQuery(country.name);
  }

  async function handleExploreStart(country) {
    if (!country?.code || !country?.name) {
      return;
    }

    await ensureCitiesLoaded(country.code);
    setCityDraft((current) => ({
      ...current,
      country: country.name,
      countryCode: country.code,
      name: "",
      lat: "",
      lng: ""
    }));
    setCityCountryQuery(country.name);
    setCityQuery("");
  }

  async function handleExploreCitySuggestion(country, city) {
    if (!country?.code || !city) {
      return;
    }

    await ensureCitiesLoaded(country.code);
    const lat = Number(city.latitude);
    const lng = Number(city.longitude);

    setCityDraft((current) => ({
      ...current,
      country: country.name,
      countryCode: country.code,
      name: city.name,
      lat: lat.toFixed(4),
      lng: lng.toFixed(4)
    }));
    setCityCountryQuery(country.name);
    setCityQuery(city.name);
    setSelectedLatLng({ lat, lng });
  }

  function handleExportData() {
    const blob = new Blob([JSON.stringify(exportTravelPayload(travelState), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "travel-tracker-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportData(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const nextState = importTravelPayload(text, catalog);
      setTravelState(nextState);
      setOpenCountry(firstOpenCountry(nextState));
      setActiveNotePanel(null);
      setStorageStatus("pending");
      event.target.value = "";
    } catch {
      event.target.value = "";
      window.alert("JSON dosyasi okunamadi. Lutfen gecerli bir seyahat yedegi secin.");
    }
  }

  function handleLoadDemoData() {
    const nextState = normalizeTravelState(demoTravelState, catalog);
    setTravelState(nextState);
    setOpenCountry("Turkey");
    setSelectedLatLng({ lat: 38.4237, lng: 27.1428 });
    setActiveNotePanel({ type: "city", id: "demo-izmir" });
    setStorageStatus("pending");
    resetCityForm();
  }

  function handleFocusCity(city) {
    setActiveNotePanel({ type: "city", id: city.id });
    if (mapInstance) {
      mapInstance.flyTo([city.lat, city.lng], Math.max(mapInstance.getZoom(), 6), {
        duration: 1.4
      });
    }
  }

  function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []).slice(0, 2);

    if (!activeCity || files.length === 0) {
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: crypto.randomUUID(),
                name: file.name,
                src: reader.result
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    )
      .then((photos) => {
        setTravelState((current) => addPhotosToCity(current, activeCity.id, photos));
        setStorageStatus("pending");
        event.target.value = "";
      })
      .catch(() => {
        event.target.value = "";
        window.alert("Fotograflar okunamadi. Lutfen farkli dosyalarla tekrar deneyin.");
      });
  }

  function handleDeletePhoto(cityId, photoId) {
    setTravelState((current) => deletePhotoFromCity(current, cityId, photoId));
  }

  function handleCityCountryQueryChange(value) {
    setCityCountryQuery(value);
    setCityDraft((current) => ({
      ...current,
      country: value,
      countryCode: getCountryByName(value, catalog)?.isoCode || "",
      name: "",
      lat: selectedLatLng ? selectedLatLng.lat.toFixed(4) : current.lat,
      lng: selectedLatLng ? selectedLatLng.lng.toFixed(4) : current.lng
    }));
    setCityQuery("");
  }

  function handleCityQueryChange(value) {
    setCityQuery(value);
    setCityDraft((current) => ({
      ...current,
      name: value
    }));
  }

  function handleOriginCountryQueryChange(value) {
    setOriginCountryQuery(value);
    setOriginDraft((current) => ({
      ...current,
      country: value,
      countryCode: getCountryByName(value, catalog)?.isoCode || "",
      name: "",
      lat: "",
      lng: ""
    }));
    setCityDraft((current) => ({
      ...current,
      fromCityId: ""
    }));
    setOriginCityQuery("");
  }

  function handleOriginCityQueryChange(value) {
    setOriginCityQuery(value);
    setOriginDraft((current) => ({
      ...current,
      name: value,
      lat: "",
      lng: ""
    }));
    setCityDraft((current) => ({
      ...current,
      fromCityId: ""
    }));
  }

  function handleWishlistCountryQueryChange(value) {
    setWishlistCountryQuery(value);
    setWishlistDraft((current) => ({
      ...current,
      country: value,
      countryCode: getCountryByName(value, catalog)?.isoCode || ""
    }));
  }

  return {
    activeCity,
    activeCountry,
    activeNotePanel,
    activeOriginCityName,
    arcSets,
    catalog,
    catalogStatus,
    cityCountryOptions,
    cityCountryQuery,
    cityDraft,
    cityDraftDuration,
    cityOptions,
    cityQuery,
    citySurfacePercent,
    countryNameDraft,
    countryNames,
    ensureCatalogLoaded,
    ensureCitiesLoaded,
    globeTheme,
    groupedCountries,
    handleCityCountryQueryChange,
    handleCityCountrySelect,
    handleCityNoteSave,
    handleCityQueryChange,
    handleCitySelect,
    handleCitySubmit,
    handleCountryNoteSave,
    handleCountryRename,
    handleDeleteCity,
    handleDeleteCountry,
    handleDeletePhoto,
    handleEditCity,
    handleExportData,
    handleFocusCity,
    handleImportData,
    handleLoadDemoData,
    handleQuickWishlistAdd,
    handleOriginCityQueryChange,
    handleOriginCitySelect,
    handleOriginCountryQueryChange,
    handleOriginCountrySelect,
    handlePhotoUpload,
    handleExploreCitySuggestion,
    handleExploreStart,
    handleWishlistCountryQueryChange,
    handleWishlistCountrySelect,
    handleWishlistDelete,
    handleWishlistEdit,
    handleWishlistSubmit,
    mapStyle,
    openCountry,
    originCityOptions,
    originCityQuery,
    originCountryOptions,
    originCountryQuery,
    originDraft,
    resetCityDraft: resetCityForm,
    resetWishlistDraft,
    searchQuery,
    searchedCityResults,
    selectedLatLng,
    setActiveNotePanel,
    setCityDraft,
    setCountryNameDraft,
    setGlobeTheme,
    setMapInstance,
    setMapStyle,
    setOpenCountry,
    setSearchQuery,
    setSelectedLatLng,
    setWishlistDraft,
    sortedWishlist,
    storageStatus,
    totalCities,
    totalCountries,
    totalRouteDistance,
    totalTravelDays,
    travelState,
    visitedCountryCodes,
    wishlistCountryOptions,
    wishlistCountryQuery,
    wishlistDraft,
    worldPercent
  };
}
