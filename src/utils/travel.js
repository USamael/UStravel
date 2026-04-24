export const STORAGE_KEY = "travel-tracker-state-v1";
const STORAGE_DB_NAME = "travel-tracker-db";
const STORAGE_DB_VERSION = 1;
const STORAGE_STORE_NAME = "travel-state";
const STORAGE_RECORD_KEY = "app-state";

export const WORLD_BOUNDS = [
  [-90, -180],
  [90, 180]
];

export const MAP_STYLES = {
  dark: {
    id: "dark",
    label: "Minimal Karanlik",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
  },
  voyager: {
    id: "voyager",
    label: "Yol Haritasi",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
  },
  light: {
    id: "light",
    label: "Aydinlik Minimal",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
  }
};

export const DEFAULT_CATALOG = {
  allCountries: [],
  countriesByCode: new Map(),
  countriesByName: new Map(),
  cityCache: new Map(),
  cityLoadStatus: new Map(),
  referenceCityPoints: []
};

export const ESTIMATED_WORLD_COUNTRIES = 195;
export const ESTIMATED_WORLD_CITY_AREAS = 50000;

export const starterState = {
  cities: [
    {
      id: crypto.randomUUID(),
      name: "Istanbul",
      country: "Turkey",
      countryCode: "TR",
      fromCityId: "",
      lat: 41.0082,
      lng: 28.9784,
      arrivalDate: "2023-05-12",
      departureDate: "2023-05-15",
      note: "Gün batımında vapur ve eski şehir sokakları.",
      photos: []
    },
    {
      id: crypto.randomUUID(),
      name: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      fromCityId: "",
      lat: 35.6762,
      lng: 139.6503,
      arrivalDate: "2024-10-03",
      departureDate: "",
      note: "Gece trenleri, küçük ramen dükkanları ve neon yağmuru.",
      photos: []
    }
  ],
  countryNotes: {
    Turkey: "Her seferinde bir gün daha kalmaya değen bir yer.",
    Japan: "Bir sonraki gelişte daha sakin, kırsala yakın bir rota yapılmalı."
  },
  wishlist: [
    {
      id: crypto.randomUUID(),
      country: "Iceland",
      countryCode: "IS",
      rank: 1,
      note: "Ring Road rotasını sakin sezonda görmek istiyorum."
    },
    {
      id: crypto.randomUUID(),
      country: "Peru",
      countryCode: "PE",
      rank: 2,
      note: "İç kesimlere geçmeden önce Lima'da yemek rotası."
    }
  ]
};

export const demoTravelState = {
  cities: [
    {
      id: "demo-izmir",
      name: "Izmir",
      country: "Turkey",
      countryCode: "TR",
      fromCityId: "",
      lat: 38.4237,
      lng: 27.1428,
      arrivalDate: "2023-04-01",
      departureDate: "2023-04-04",
      note: "Demo rota Izmir'den basliyor. Kordon, Alsancak ve sakin bir Ege sabahi.",
      photos: []
    },
    {
      id: "demo-istanbul",
      name: "Istanbul",
      country: "Turkey",
      countryCode: "TR",
      fromCityId: "demo-izmir",
      lat: 41.0082,
      lng: 28.9784,
      arrivalDate: "2023-04-04",
      departureDate: "2023-04-08",
      note: "Vapur, tarihi yarimada ve gece yuruyusleri.",
      photos: []
    },
    {
      id: "demo-athens",
      name: "Athens",
      country: "Greece",
      countryCode: "GR",
      fromCityId: "demo-istanbul",
      lat: 37.9838,
      lng: 23.7275,
      arrivalDate: "2023-04-08",
      departureDate: "2023-04-11",
      note: "Akropolis ve Plaka sokaklari.",
      photos: []
    },
    {
      id: "demo-thessaloniki",
      name: "Thessaloniki",
      country: "Greece",
      countryCode: "GR",
      fromCityId: "demo-athens",
      lat: 40.6401,
      lng: 22.9444,
      arrivalDate: "2023-04-11",
      departureDate: "2023-04-13",
      note: "Sahil hatti ve kahve molalari.",
      photos: []
    },
    {
      id: "demo-rome",
      name: "Rome",
      country: "Italy",
      countryCode: "IT",
      fromCityId: "demo-thessaloniki",
      lat: 41.9028,
      lng: 12.4964,
      arrivalDate: "2023-04-13",
      departureDate: "2023-04-18",
      note: "Kolezyum, Trastevere ve uzun yemekler.",
      photos: []
    },
    {
      id: "demo-florence",
      name: "Florence",
      country: "Italy",
      countryCode: "IT",
      fromCityId: "demo-rome",
      lat: 43.7696,
      lng: 11.2558,
      arrivalDate: "2023-04-18",
      departureDate: "2023-04-21",
      note: "Ronesans muzeleri ve Arno kiyisi.",
      photos: []
    },
    {
      id: "demo-barcelona",
      name: "Barcelona",
      country: "Spain",
      countryCode: "ES",
      fromCityId: "demo-florence",
      lat: 41.3874,
      lng: 2.1686,
      arrivalDate: "2023-04-21",
      departureDate: "2023-04-25",
      note: "Gaudi rotasi ve deniz kenari.",
      photos: []
    },
    {
      id: "demo-madrid",
      name: "Madrid",
      country: "Spain",
      countryCode: "ES",
      fromCityId: "demo-barcelona",
      lat: 40.4168,
      lng: -3.7038,
      arrivalDate: "2023-04-25",
      departureDate: "2023-04-28",
      note: "Muzeler, meydanlar ve tapas.",
      photos: []
    },
    {
      id: "demo-paris",
      name: "Paris",
      country: "France",
      countryCode: "FR",
      fromCityId: "demo-madrid",
      lat: 48.8566,
      lng: 2.3522,
      arrivalDate: "2023-04-28",
      departureDate: "2023-05-03",
      note: "Seine kiyisi ve mahalle firinlari.",
      photos: []
    },
    {
      id: "demo-lyon",
      name: "Lyon",
      country: "France",
      countryCode: "FR",
      fromCityId: "demo-paris",
      lat: 45.764,
      lng: 4.8357,
      arrivalDate: "2023-05-03",
      departureDate: "2023-05-05",
      note: "Yemek duragi ve eski sokaklar.",
      photos: []
    },
    {
      id: "demo-berlin",
      name: "Berlin",
      country: "Germany",
      countryCode: "DE",
      fromCityId: "demo-lyon",
      lat: 52.52,
      lng: 13.405,
      arrivalDate: "2023-05-05",
      departureDate: "2023-05-10",
      note: "Muzeler adasi ve sokak sanati.",
      photos: []
    },
    {
      id: "demo-munich",
      name: "Munich",
      country: "Germany",
      countryCode: "DE",
      fromCityId: "demo-berlin",
      lat: 48.1351,
      lng: 11.582,
      arrivalDate: "2023-05-10",
      departureDate: "2023-05-12",
      note: "Parklar ve gunubirlik Bavyera planlari.",
      photos: []
    },
    {
      id: "demo-amsterdam",
      name: "Amsterdam",
      country: "Netherlands",
      countryCode: "NL",
      fromCityId: "demo-munich",
      lat: 52.3676,
      lng: 4.9041,
      arrivalDate: "2023-05-12",
      departureDate: "2023-05-15",
      note: "Kanallar ve bisiklet rotalari.",
      photos: []
    },
    {
      id: "demo-rotterdam",
      name: "Rotterdam",
      country: "Netherlands",
      countryCode: "NL",
      fromCityId: "demo-amsterdam",
      lat: 51.9244,
      lng: 4.4777,
      arrivalDate: "2023-05-15",
      departureDate: "2023-05-16",
      note: "Modern mimari icin kisa durak.",
      photos: []
    },
    {
      id: "demo-london",
      name: "London",
      country: "United Kingdom",
      countryCode: "GB",
      fromCityId: "demo-rotterdam",
      lat: 51.5072,
      lng: -0.1276,
      arrivalDate: "2023-05-16",
      departureDate: "2023-05-21",
      note: "Muzeler, parklar ve Thames kiyisi.",
      photos: []
    },
    {
      id: "demo-edinburgh",
      name: "Edinburgh",
      country: "United Kingdom",
      countryCode: "GB",
      fromCityId: "demo-london",
      lat: 55.9533,
      lng: -3.1883,
      arrivalDate: "2023-05-21",
      departureDate: "2023-05-24",
      note: "Kale, tas sokaklar ve sisli tepeler.",
      photos: []
    },
    {
      id: "demo-oslo",
      name: "Oslo",
      country: "Norway",
      countryCode: "NO",
      fromCityId: "demo-edinburgh",
      lat: 59.9139,
      lng: 10.7522,
      arrivalDate: "2023-05-24",
      departureDate: "2023-05-27",
      note: "Fiyort hissi ve sakin liman.",
      photos: []
    },
    {
      id: "demo-bergen",
      name: "Bergen",
      country: "Norway",
      countryCode: "NO",
      fromCityId: "demo-oslo",
      lat: 60.3913,
      lng: 5.3221,
      arrivalDate: "2023-05-27",
      departureDate: "2023-05-30",
      note: "Renkli evler ve yagmur manzarasi.",
      photos: []
    },
    {
      id: "demo-reykjavik",
      name: "Reykjavik",
      country: "Iceland",
      countryCode: "IS",
      fromCityId: "demo-bergen",
      lat: 64.1466,
      lng: -21.9426,
      arrivalDate: "2023-05-30",
      departureDate: "2023-06-04",
      note: "Kuzey rotasinin baslangici.",
      photos: []
    },
    {
      id: "demo-akureyri",
      name: "Akureyri",
      country: "Iceland",
      countryCode: "IS",
      fromCityId: "demo-reykjavik",
      lat: 65.6885,
      lng: -18.1262,
      arrivalDate: "2023-06-04",
      departureDate: "2023-06-07",
      note: "Ring Road uzerinde sakin durak.",
      photos: []
    },
    {
      id: "demo-tokyo",
      name: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      fromCityId: "demo-akureyri",
      lat: 35.6762,
      lng: 139.6503,
      arrivalDate: "2023-06-07",
      departureDate: "2023-06-13",
      note: "Neon, trenler ve ramen.",
      photos: []
    },
    {
      id: "demo-kyoto",
      name: "Kyoto",
      country: "Japan",
      countryCode: "JP",
      fromCityId: "demo-tokyo",
      lat: 35.0116,
      lng: 135.7681,
      arrivalDate: "2023-06-13",
      departureDate: "2023-06-17",
      note: "Tapinaklar ve bambu ormani.",
      photos: []
    },
    {
      id: "demo-bangkok",
      name: "Bangkok",
      country: "Thailand",
      countryCode: "TH",
      fromCityId: "demo-kyoto",
      lat: 13.7563,
      lng: 100.5018,
      arrivalDate: "2023-06-17",
      departureDate: "2023-06-22",
      note: "Sokak yemekleri ve tapinaklar.",
      photos: []
    },
    {
      id: "demo-chiang-mai",
      name: "Chiang Mai",
      country: "Thailand",
      countryCode: "TH",
      fromCityId: "demo-bangkok",
      lat: 18.7883,
      lng: 98.9853,
      arrivalDate: "2023-06-22",
      departureDate: "2023-06-25",
      note: "Kuzey Tayland ve sakin pazarlar.",
      photos: []
    },
    {
      id: "demo-marrakesh",
      name: "Marrakesh",
      country: "Morocco",
      countryCode: "MA",
      fromCityId: "demo-chiang-mai",
      lat: 31.6295,
      lng: -7.9811,
      arrivalDate: "2023-06-25",
      departureDate: "2023-06-29",
      note: "Medina, baharatlar ve avlular.",
      photos: []
    },
    {
      id: "demo-casablanca",
      name: "Casablanca",
      country: "Morocco",
      countryCode: "MA",
      fromCityId: "demo-marrakesh",
      lat: 33.5731,
      lng: -7.5898,
      arrivalDate: "2023-06-29",
      departureDate: "2023-07-01",
      note: "Atlantik kiyisi ve kisa sehir molasi.",
      photos: []
    },
    {
      id: "demo-new-york",
      name: "New York",
      country: "United States",
      countryCode: "US",
      fromCityId: "demo-casablanca",
      lat: 40.7128,
      lng: -74.006,
      arrivalDate: "2023-07-01",
      departureDate: "2023-07-07",
      note: "Manhattan yuruyusleri ve skyline.",
      photos: []
    },
    {
      id: "demo-san-francisco",
      name: "San Francisco",
      country: "United States",
      countryCode: "US",
      fromCityId: "demo-new-york",
      lat: 37.7749,
      lng: -122.4194,
      arrivalDate: "2023-07-07",
      departureDate: "2023-07-10",
      note: "Kopru, tepeler ve sis.",
      photos: []
    },
    {
      id: "demo-rio",
      name: "Rio de Janeiro",
      country: "Brazil",
      countryCode: "BR",
      fromCityId: "demo-san-francisco",
      lat: -22.9068,
      lng: -43.1729,
      arrivalDate: "2023-07-10",
      departureDate: "2023-07-15",
      note: "Copacabana ve tepe manzaralari.",
      photos: []
    },
    {
      id: "demo-sao-paulo",
      name: "Sao Paulo",
      country: "Brazil",
      countryCode: "BR",
      fromCityId: "demo-rio",
      lat: -23.5558,
      lng: -46.6396,
      arrivalDate: "2023-07-15",
      departureDate: "2023-07-18",
      note: "Demo rotanin kapanis duragi.",
      photos: []
    }
  ],
  countryNotes: {
    Turkey: "Demo rota Izmir'den baslayan Ege cikisli bir yolculuk.",
    Greece: "Kisa ama yogun Akdeniz gecisi.",
    Italy: "Tarih ve yemek odakli duraklar.",
    Spain: "Buyuk sehir ritmi ve meydanlar.",
    France: "Sehir yuruyusleri ve gastronomi.",
    Germany: "Muze ve park agirlikli plan.",
    Netherlands: "Kanal ve mimari rotasi.",
    "United Kingdom": "Londra'dan Edinburgh'a uzanan kuzey hissi.",
    Norway: "Fiyortlara yaklasan sakin rota.",
    Iceland: "Doga odakli kuzey denemesi.",
    Japan: "Buyuk sehirden geleneksel sokaklara gecis.",
    Thailand: "Yemek, pazar ve tapinak gunleri.",
    Morocco: "Medina ve Atlantik kiyisi.",
    "United States": "Iki kiyili Amerika duragi.",
    Brazil: "Gunesli kapanis ve devam eden rota."
  },
  wishlist: [
    {
      id: "demo-wishlist-argentina",
      country: "Argentina",
      countryCode: "AR",
      rank: 1,
      note: "Patagonya ve Buenos Aires sonraki buyuk rota."
    },
    {
      id: "demo-wishlist-new-zealand",
      country: "New Zealand",
      countryCode: "NZ",
      rank: 2,
      note: "Uzun dogal rota ve karavan fikri."
    },
    {
      id: "demo-wishlist-south-africa",
      country: "South Africa",
      countryCode: "ZA",
      rank: 3,
      note: "Cape Town ve Garden Route."
    }
  ]
};

export function normalizeText(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  const dateValue = typeof value === "string" ? value.slice(0, 10) : String(value).slice(0, 10);
  const date = new Date(`${dateValue}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value.slice(0, 10) : String(value).slice(0, 10);
}

export function calculateDuration(start, end) {
  const arrival = parseDateOnly(start);

  if (!arrival) {
    return {
      days: 0,
      nights: 0,
      isOngoing: false,
      label: "Tarih secilmedi",
      badge: "Tarih yok"
    };
  }

  const parsedDeparture = parseDateOnly(end);
  const hasDeparture = Boolean(parsedDeparture);
  const departure = parsedDeparture || parseDateOnly(new Date().toISOString().slice(0, 10));
  const dayMs = 1000 * 60 * 60 * 24;
  const rawDiffDays = Math.max(0, Math.round((departure.getTime() - arrival.getTime()) / dayMs));
  const days = rawDiffDays + 1;
  const nights = Math.max(0, days - 1);

  if (!hasDeparture) {
    return {
      days,
      nights,
      isOngoing: true,
      label: "Devam ediyor",
      badge: "Devam"
    };
  }

  if (days === 1) {
    return {
      days: 1,
      nights: 0,
      isOngoing: false,
      label: "1 Gün (Günübirlik)",
      badge: "1 gün"
    };
  }

  return {
    days,
    nights,
    isOngoing: false,
    label: `${nights} Gece ${days} Gün`,
    badge: `${days} gün`
  };
}

export function formatTravelDate(value) {
  const date = parseDateOnly(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function formatTravelDateRange(start, end) {
  if (!start) {
    return "Tarih eklenmedi";
  }

  const arrival = formatTravelDate(start);
  const departure = end ? formatTravelDate(end) : "Devam ediyor";

  return `${arrival} - ${departure}`;
}

export function calculateTotalTravelDays(cities) {
  return cities.reduce((total, city) => total + calculateDuration(city.arrivalDate, city.departureDate).days, 0);
}

export function createCatalogHelpers(countries) {
  const allCountries = [...countries].sort((left, right) => left.name.localeCompare(right.name));
  const countriesByCode = new Map(allCountries.map((country) => [country.isoCode, country]));
  const countriesByName = new Map(allCountries.map((country) => [country.name.toLowerCase(), country]));
  const cityCache = new Map();

  return {
    allCountries,
    countriesByCode,
    countriesByName,
    cityCache,
    cityLoadStatus: new Map(),
    referenceCityPoints: [],
    module: null
  };
}

export async function fetchCatalogCountries() {
  const response = await fetch("/catalog/countries.json");

  if (!response.ok) {
    throw new Error("Country catalog could not be loaded.");
  }

  return response.json();
}

export async function fetchCitiesForCountry(countryCode) {
  const response = await fetch(`/catalog/cities/${countryCode}.json`);

  if (!response.ok) {
    throw new Error(`City catalog for ${countryCode} could not be loaded.`);
  }

  return response.json();
}

function openStorageDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(STORAGE_DB_NAME, STORAGE_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORAGE_STORE_NAME)) {
        database.createObjectStore(STORAGE_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readStateFromDb() {
  return openStorageDb()
    .then((database) => {
      if (!database) {
        return null;
      }

      return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORAGE_STORE_NAME, "readonly");
        const store = transaction.objectStore(STORAGE_STORE_NAME);
        const request = store.get(STORAGE_RECORD_KEY);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => reject(transaction.error);
      });
    })
    .catch(() => null);
}

function writeStateToDb(state) {
  return openStorageDb()
    .then((database) => {
      if (!database) {
        return false;
      }

      return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORAGE_STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORAGE_STORE_NAME);

        store.put(state, STORAGE_RECORD_KEY);
        transaction.oncomplete = () => {
          database.close();
          resolve(true);
        };
        transaction.onerror = () => reject(transaction.error);
      });
    })
    .catch(() => false);
}

function createStorageFallbackState(state) {
  return {
    ...state,
    cities: state.cities.map((city) => ({
      ...city,
      photos: []
    }))
  };
}

export function haversineDistance(start, end) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  // Haversine keeps flight-distance estimates accurate on Earth's curved surface.
  const dLat = toRadians(end.lat - start.lat);
  const dLng = toRadians(end.lng - start.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(start.lat)) *
      Math.cos(toRadians(end.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getCountryByName(name, catalog) {
  if (!name) {
    return null;
  }

  return catalog.countriesByName.get(name.trim().toLowerCase()) || null;
}

export function getCitiesForCountry(countryCode, catalog) {
  if (!countryCode) {
    return [];
  }

  return catalog.cityCache.get(countryCode) || [];
}

export function setCitiesForCountry(countryCode, cities, catalog) {
  const nextCatalog = {
    ...catalog,
    cityCache: new Map(catalog.cityCache),
    cityLoadStatus: new Map(catalog.cityLoadStatus)
  };

  nextCatalog.cityCache.set(
    countryCode,
    [...cities].sort((left, right) => left.name.localeCompare(right.name))
  );
  nextCatalog.cityLoadStatus.set(countryCode, "loaded");

  return nextCatalog;
}

export function normalizeTravelState(rawState, catalog = DEFAULT_CATALOG) {
  const cities = Array.isArray(rawState?.cities) ? rawState.cities : starterState.cities;
  const wishlist = Array.isArray(rawState?.wishlist) ? rawState.wishlist : starterState.wishlist;

  return {
    cities: cities.map((city) => ({
      ...city,
      lat: Number.isFinite(Number(city.lat)) ? Number(city.lat) : 0,
      lng: Number.isFinite(Number(city.lng)) ? Number(city.lng) : 0,
      countryCode: city.countryCode || getCountryByName(city.country, catalog)?.isoCode || "",
      fromCityId: city.fromCityId || "",
      arrivalDate: toDateInputValue(city.arrivalDate),
      departureDate: toDateInputValue(city.departureDate),
      note: city.note || "",
      photos: Array.isArray(city.photos) ? city.photos : []
    })),
    countryNotes:
      rawState?.countryNotes && typeof rawState.countryNotes === "object"
        ? rawState.countryNotes
        : starterState.countryNotes,
    wishlist: wishlist.map((entry) => ({
      ...entry,
      countryCode: entry.countryCode || getCountryByName(entry.country, catalog)?.isoCode || "",
      rank: Number.isFinite(Number(entry.rank)) ? Number(entry.rank) : 999,
      note: entry.note || ""
    }))
  };
}

export async function loadState(catalog = DEFAULT_CATALOG) {
  try {
    const dbState = await readStateFromDb();

    if (dbState) {
      return normalizeTravelState(dbState, catalog);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return normalizeTravelState(starterState, catalog);
    }

    return normalizeTravelState(JSON.parse(raw), catalog);
  } catch {
    return normalizeTravelState(starterState, catalog);
  }
}

export async function saveState(state) {
  const storedInDb = await writeStateToDb(state);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(createStorageFallbackState(state)));
    return storedInDb || true;
  } catch {
    return storedInDb;
  }
}

export function buildArcPoints(start, end) {
  const steps = 40;
  const points = [];
  const deltaLng = end.lng - start.lng;
  const deltaLat = end.lat - start.lat;
  const distance = Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat);
  const curveHeight = Math.max(6, distance * 0.18);

  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const lat = start.lat + deltaLat * t + Math.sin(Math.PI * t) * curveHeight;
    const lng = start.lng + deltaLng * t;
    points.push([lat, lng]);
  }

  return points;
}

export function getVisitedCityAreaRadius(isActive) {
  return isActive ? 14000 : 9000;
}

export function arcSetsDistance(cities) {
  return cities.reduce((total, city) => {
    const originCity = cities.find((candidate) => candidate.id === city.fromCityId);

    if (!originCity) {
      return total;
    }

    return total + haversineDistance(originCity, city);
  }, 0);
}

export function groupCitiesByCountry(cities) {
  return cities.reduce((groups, city) => {
    const countryName = city.country || "Ulke belirtilmedi";

    if (!groups[countryName]) {
      groups[countryName] = [];
    }

    groups[countryName].push(city);
    return groups;
  }, {});
}

export function inferTravelMode(originCity, destinationCity) {
  if (!originCity || !destinationCity) {
    return {
      id: "start",
      icon: "•",
      label: "Baslangic"
    };
  }

  const distanceKm = haversineDistance(originCity, destinationCity);

  if (originCity.countryCode !== destinationCity.countryCode || distanceKm > 1400) {
    return {
      id: "plane",
      icon: "Ucak",
      label: "Ucus"
    };
  }

  if (distanceKm > 280) {
    return {
      id: "train",
      icon: "Tren",
      label: "Tren"
    };
  }

  return {
    id: "bus",
    icon: "Otobus",
    label: "Kara yolu"
  };
}

export function compareCitiesByDate(left, right) {
  const leftValue = left.arrivalDate || left.departureDate || "";
  const rightValue = right.arrivalDate || right.departureDate || "";

  if (leftValue && rightValue && leftValue !== rightValue) {
    return leftValue.localeCompare(rightValue);
  }

  return `${left.country}-${left.name}`.localeCompare(`${right.country}-${right.name}`);
}

export function getTravelYears(cities) {
  return [...new Set(
    cities
      .map((city) => (city.arrivalDate || city.departureDate || "").slice(0, 4))
      .filter(Boolean)
  )].sort((left, right) => Number(right) - Number(left));
}

export function buildTravelSummary(cities, selectedYear = "all") {
  const sortedCities = [...cities].sort(compareCitiesByDate);
  const filteredCities =
    selectedYear === "all"
      ? sortedCities
      : sortedCities.filter((city) => (city.arrivalDate || city.departureDate || "").startsWith(String(selectedYear)));
  const filteredIds = new Set(filteredCities.map((city) => city.id));
  const citiesById = new Map(filteredCities.map((city) => [city.id, city]));
  const routeSegments = filteredCities
    .map((city) => {
      const originCity = citiesById.get(city.fromCityId);

      if (!originCity || !filteredIds.has(originCity.id)) {
        return null;
      }

      return {
        city,
        originCity,
        distanceKm: haversineDistance(originCity, city)
      };
    })
    .filter(Boolean);
  const countryCounts = filteredCities.reduce((counts, city) => {
    counts.set(city.country, (counts.get(city.country) || 0) + 1);
    return counts;
  }, new Map());
  const mostVisitedCountryEntry = [...countryCounts.entries()].sort((left, right) => right[1] - left[1])[0];
  const longestRoute = [...routeSegments].sort((left, right) => right.distanceKm - left.distanceKm)[0] || null;
  const mostPhotographedCity = [...filteredCities].sort(
    (left, right) => (right.photos?.length || 0) - (left.photos?.length || 0)
  )[0] || null;
  const busiestMonths = [...filteredCities.reduce((months, city) => {
    if (!city.arrivalDate) {
      return months;
    }

    const key = city.arrivalDate.slice(0, 7);
    months.set(key, (months.get(key) || 0) + 1);
    return months;
  }, new Map()).entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 2);

  return {
    filteredCities,
    longestRoute,
    mostPhotographedCity,
    mostVisitedCountry: mostVisitedCountryEntry
      ? {
          name: mostVisitedCountryEntry[0],
          count: mostVisitedCountryEntry[1]
        }
      : null,
    totalDistanceKm: routeSegments.reduce((total, segment) => total + segment.distanceKm, 0),
    totalTravelDays: calculateTotalTravelDays(filteredCities),
    busiestMonths
  };
}
