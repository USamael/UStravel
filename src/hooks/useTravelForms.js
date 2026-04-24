import { useState } from "react";

export const emptyCityDraft = {
  id: null,
  name: "",
  country: "",
  countryCode: "",
  fromCityId: "",
  lat: "",
  lng: "",
  arrivalDate: "",
  departureDate: "",
  note: ""
};

export const emptyOriginDraft = {
  country: "",
  countryCode: "",
  name: "",
  lat: "",
  lng: ""
};

export const emptyWishlistDraft = {
  id: null,
  country: "",
  countryCode: "",
  rank: "",
  note: ""
};

export function useTravelForms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDraft, setCityDraft] = useState(emptyCityDraft);
  const [cityCountryQuery, setCityCountryQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [originDraft, setOriginDraft] = useState(emptyOriginDraft);
  const [originCountryQuery, setOriginCountryQuery] = useState("");
  const [originCityQuery, setOriginCityQuery] = useState("");
  const [wishlistDraft, setWishlistDraft] = useState(emptyWishlistDraft);
  const [wishlistCountryQuery, setWishlistCountryQuery] = useState("");
  const [countryNameDraft, setCountryNameDraft] = useState("");

  function resetCityDraft(selectedLatLng) {
    setCityDraft({
      ...emptyCityDraft,
      lat: selectedLatLng ? selectedLatLng.lat.toFixed(4) : "",
      lng: selectedLatLng ? selectedLatLng.lng.toFixed(4) : ""
    });
    setCityCountryQuery("");
    setCityQuery("");
    setOriginDraft(emptyOriginDraft);
    setOriginCountryQuery("");
    setOriginCityQuery("");
  }

  function resetWishlistDraft() {
    setWishlistDraft(emptyWishlistDraft);
    setWishlistCountryQuery("");
  }

  return {
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
  };
}
