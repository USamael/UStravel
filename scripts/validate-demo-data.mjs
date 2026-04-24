import {
  calculateDuration,
  calculateTotalTravelDays,
  demoTravelState,
  haversineDistance,
  normalizeTravelState
} from "../src/utils/travel.js";

const state = normalizeTravelState(demoTravelState);
const cityIds = new Set(state.cities.map((city) => city.id));
const countryCount = new Set(state.cities.map((city) => city.country)).size;
const routeBreaks = state.cities.filter((city) => city.fromCityId && !cityIds.has(city.fromCityId));
const invalidDurations = state.cities.filter((city) => calculateDuration(city.arrivalDate, city.departureDate).days < 1);
const invalidDistances = state.cities
  .filter((city) => city.fromCityId)
  .map((city) => {
    const origin = state.cities.find((candidate) => candidate.id === city.fromCityId);
    return origin ? haversineDistance(origin, city) : 0;
  })
  .filter((distance) => !Number.isFinite(distance) || distance <= 0);

const checks = [
  ["30 sehir olmali", state.cities.length === 30],
  ["15 ulke olmali", countryCount === 15],
  ["Ilk sehir Izmir olmali", state.cities[0]?.name === "Izmir"],
  ["Rota baglantilari kopuk olmamali", routeBreaks.length === 0],
  ["Tum sureler en az 1 gun olmali", invalidDurations.length === 0],
  ["Tum mesafeler hesaplanabilir olmali", invalidDistances.length === 0],
  ["Toplam seyahat suresi pozitif olmali", calculateTotalTravelDays(state.cities) > 0]
];

const failed = checks.filter(([, passed]) => !passed);

for (const [label, passed] of checks) {
  console.log(`${passed ? "OK" : "FAIL"} - ${label}`);
}

console.log(`Toplam sehir: ${state.cities.length}`);
console.log(`Toplam ulke: ${countryCount}`);
console.log(`Toplam seyahat suresi: ${calculateTotalTravelDays(state.cities)} gun`);

if (failed.length > 0) {
  process.exit(1);
}
