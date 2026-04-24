import { useMemo, useState } from "react";
import { buildTravelSummary, getTravelYears } from "../utils/travel";
import { SectionCard } from "./ui";

function SummaryTile({ label, value, detail }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-xl text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
    </div>
  );
}

export default function TravelSummary({ cities }) {
  const years = useMemo(() => getTravelYears(cities), [cities]);
  const [selectedYear, setSelectedYear] = useState("all");
  const summary = useMemo(() => buildTravelSummary(cities, selectedYear), [cities, selectedYear]);

  const busiestMonthsLabel =
    summary.busiestMonths.length > 0
      ? summary.busiestMonths.map(([month, count]) => `${month} (${count})`).join(" • ")
      : "Yeterli veri yok";

  return (
    <SectionCard title="Seyahat Ozetin" detail="Flighty / Wrapped hissi veren yillik ve tum zamanlar ozeti.">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedYear("all")}
          className={`min-h-10 rounded-2xl px-4 text-sm font-semibold transition ${
            selectedYear === "all" ? "bg-teal-200 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          Tum zamanlar
        </button>
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setSelectedYear(year)}
            className={`min-h-10 rounded-2xl px-4 text-sm font-semibold transition ${
              selectedYear === year ? "bg-teal-200 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SummaryTile
          label="Toplam Mesafe"
          value={`${Math.round(summary.totalDistanceKm).toLocaleString("tr-TR")} km`}
          detail={`${summary.filteredCities.length} durak uzerinden hesaplandi`}
        />
        <SummaryTile
          label="En Cok Gidilen Ulke"
          value={summary.mostVisitedCountry ? summary.mostVisitedCountry.name : "Veri yok"}
          detail={
            summary.mostVisitedCountry
              ? `${summary.mostVisitedCountry.count} farkli kayitli durak`
              : "Ulke karsilastirmasi icin daha fazla rota ekleyin"
          }
        />
        <SummaryTile
          label="En Uzun Rota"
          value={
            summary.longestRoute
              ? `${summary.longestRoute.originCity.name} -> ${summary.longestRoute.city.name}`
              : "Veri yok"
          }
          detail={
            summary.longestRoute
              ? `${Math.round(summary.longestRoute.distanceKm).toLocaleString("tr-TR")} km`
              : "Baglantili rota bulunamadi"
          }
        />
        <SummaryTile
          label="En Cok Foto"
          value={summary.mostPhotographedCity ? summary.mostPhotographedCity.name : "Veri yok"}
          detail={
            summary.mostPhotographedCity
              ? `${summary.mostPhotographedCity.photos?.length || 0} fotograf`
              : "Fotograf verisi bulunmuyor"
          }
        />
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Hizli Icerik</p>
        <p className="mt-3 text-sm text-slate-200">
          En hizli art arda seyahat edilen aylar: <span className="font-semibold text-white">{busiestMonthsLabel}</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Toplam seyahat suresi: {summary.totalTravelDays.toLocaleString("tr-TR")} gun
        </p>
      </div>
    </SectionCard>
  );
}
