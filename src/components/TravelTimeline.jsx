import { useMemo } from "react";
import { calculateDuration, compareCitiesByDate, formatTravelDateRange, inferTravelMode } from "../utils/travel";

export default function TravelTimeline({ cities, onFocusCity }) {
  const sortedCities = useMemo(() => [...cities].sort(compareCitiesByDate), [cities]);
  const citiesById = useMemo(() => new Map(cities.map((city) => [city.id, city])), [cities]);

  if (sortedCities.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
        Timeline gorunumu icin once bir seyahat duragi ekleyin.
      </p>
    );
  }

  return (
    <div className="relative space-y-3 pl-8">
      <div className="absolute bottom-0 left-[1.05rem] top-0 w-px bg-gradient-to-b from-teal-300/40 via-white/14 to-amber-300/30" />
      {sortedCities.map((city, index) => {
        const originCity = citiesById.get(city.fromCityId);
        const mode = inferTravelMode(originCity, city);
        const duration = calculateDuration(city.arrivalDate, city.departureDate);

        return (
          <div key={city.id} className="relative rounded-3xl border border-white/10 bg-slate-950/40 p-4">
            <div className="absolute left-[-1.65rem] top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-[10px] font-semibold text-teal-100">
              {index === 0 ? "Bas" : mode.icon}
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{index === 0 ? "Baslangic" : mode.label}</p>
                <button
                  type="button"
                  onClick={() => onFocusCity(city)}
                  className="mt-1 font-display text-lg text-white transition hover:text-teal-200"
                >
                  {city.name}
                </button>
                <p className="mt-1 text-sm text-slate-400">{city.country}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                {duration.badge}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-300">{formatTravelDateRange(city.arrivalDate, city.departureDate)}</p>
            <p className="mt-2 text-sm text-slate-400">
              {originCity ? `${originCity.name} -> ${city.name}` : "Ilk kayitli durak burada basliyor."}
            </p>
          </div>
        );
      })}
    </div>
  );
}
