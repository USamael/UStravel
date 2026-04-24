import { useState } from "react";
import ExploreGlobeWidget from "./ExploreGlobeWidget";
import type { CountryData } from "../data/exploreCountries";

export default function ExploreTabExample() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  return (
    <div className="mx-auto max-w-md p-4">
      <ExploreGlobeWidget onCountrySelected={setSelectedCountry} />

      {selectedCountry ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
          Son seçim: {selectedCountry.flag} {selectedCountry.name}
        </div>
      ) : null}
    </div>
  );
}
