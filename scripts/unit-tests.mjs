import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateDuration,
  calculateTotalTravelDays,
  demoTravelState,
  haversineDistance,
  normalizeTravelState
} from "../src/utils/travel.js";
import {
  addPhotosToCity,
  deleteCityFromState,
  deletePhotoFromCity,
  exportTravelPayload,
  importTravelPayload,
  renameCountryInState
} from "../src/utils/travelState.js";

test("import/export payload roundtrip preserves cities", () => {
  const exported = exportTravelPayload(demoTravelState, "2026-04-23T10:00:00.000Z");
  const imported = importTravelPayload(JSON.stringify(exported));

  assert.equal(imported.cities.length, demoTravelState.cities.length);
  assert.equal(imported.wishlist.length, demoTravelState.wishlist.length);
});

test("calculateDuration keeps one-day trips valid", () => {
  const duration = calculateDuration("2026-04-23", "2026-04-23");

  assert.equal(duration.days, 1);
  assert.equal(duration.nights, 0);
});

test("renameCountryInState updates country note and all cities", () => {
  const state = normalizeTravelState(demoTravelState);
  const renamed = renameCountryInState(state, "Turkey", "Turkiye", "TR");

  assert.ok(renamed.cities.every((city) => city.country !== "Turkey"));
  assert.ok(renamed.cities.some((city) => city.country === "Turkiye"));
  assert.equal(renamed.countryNotes.Turkiye, demoTravelState.countryNotes.Turkey);
});

test("deletePhotoFromCity only removes the targeted photo", () => {
  const state = normalizeTravelState({
    ...demoTravelState,
    cities: [
      {
        ...demoTravelState.cities[0],
        photos: [
          { id: "photo-1", name: "a.jpg", src: "a" },
          { id: "photo-2", name: "b.jpg", src: "b" }
        ]
      }
    ]
  });
  const nextState = deletePhotoFromCity(state, state.cities[0].id, "photo-1");

  assert.equal(nextState.cities[0].photos.length, 1);
  assert.equal(nextState.cities[0].photos[0].id, "photo-2");
});

test("addPhotosToCity caps city photos to six items", () => {
  const state = normalizeTravelState({
    ...demoTravelState,
    cities: [
      {
        ...demoTravelState.cities[0],
        photos: Array.from({ length: 5 }, (_, index) => ({
          id: `old-${index}`,
          name: `old-${index}.jpg`,
          src: `old-${index}`
        }))
      }
    ]
  });
  const nextState = addPhotosToCity(state, state.cities[0].id, [
    { id: "new-1", name: "new-1.jpg", src: "new-1" },
    { id: "new-2", name: "new-2.jpg", src: "new-2" }
  ]);

  assert.equal(nextState.cities[0].photos.length, 6);
});

test("deleteCityFromState clears dangling route references", () => {
  const state = normalizeTravelState({
    cities: [
      { id: "a", name: "A", country: "AA", countryCode: "AA", fromCityId: "", lat: 0, lng: 0, arrivalDate: "2026-01-01", departureDate: "2026-01-01", note: "", photos: [] },
      { id: "b", name: "B", country: "BB", countryCode: "BB", fromCityId: "a", lat: 1, lng: 1, arrivalDate: "2026-01-02", departureDate: "2026-01-02", note: "", photos: [] }
    ],
    countryNotes: {},
    wishlist: []
  });
  const nextState = deleteCityFromState(state, "a");

  assert.equal(nextState.cities.length, 1);
  assert.equal(nextState.cities[0].fromCityId, "");
});

test("demo data route links and totals remain valid", () => {
  const state = normalizeTravelState(demoTravelState);
  const cityIds = new Set(state.cities.map((city) => city.id));
  const routeBreaks = state.cities.filter((city) => city.fromCityId && !cityIds.has(city.fromCityId));
  const invalidDistances = state.cities
    .filter((city) => city.fromCityId)
    .map((city) => {
      const origin = state.cities.find((candidate) => candidate.id === city.fromCityId);
      return origin ? haversineDistance(origin, city) : 0;
    })
    .filter((distance) => !Number.isFinite(distance) || distance <= 0);

  assert.equal(routeBreaks.length, 0);
  assert.equal(invalidDistances.length, 0);
  assert.ok(calculateTotalTravelDays(state.cities) > 0);
});
