import { useMemo } from "react";
import { MAP_STYLES } from "../utils/travel";

const globeThemes = [
  { id: "colorful", label: "Renkli Küre" },
  { id: "night", label: "Gece Atlası" }
];

export default function MapToolbar({ globeTheme, mapMode, mapStyle, setGlobeTheme, setMapMode, setMapStyle }) {
  const modeTabs = useMemo(
    () => [
      { id: "globe", label: "Küre" },
      { id: "flat", label: "2D" }
    ],
    []
  );

  const detailTabs = useMemo(
    () =>
      mapMode === "globe"
        ? globeThemes
        : Object.values(MAP_STYLES).map((style) => ({
            id: style.id,
            label: style.label
          })),
    [mapMode]
  );

  return (
    <div className="absolute left-4 right-4 top-[7.6rem] z-[500] md:left-auto md:top-4 md:w-[20rem]">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-2.5 shadow-[0_16px_50px_rgba(2,6,23,0.28)] backdrop-blur-xl">
        <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            {modeTabs.map((tab) => {
              const isActive = mapMode === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMapMode(tab.id)}
                  className={`min-h-11 rounded-2xl px-4 text-sm font-semibold transition ${
                    isActive
                      ? "bg-teal-200 text-slate-950 shadow-[0_10px_30px_rgba(45,212,191,0.22)]"
                      : "bg-white/5 text-slate-100 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2 rounded-[24px] border border-white/8 bg-white/[0.04] p-1.5">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {detailTabs.map((tab) => {
              const isActive = mapMode === "globe" ? globeTheme === tab.id : mapStyle === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (mapMode === "globe") {
                      setGlobeTheme(tab.id);
                      return;
                    }

                    setMapStyle(tab.id);
                  }}
                  className={`min-h-11 shrink-0 rounded-2xl px-4 text-sm font-semibold transition ${
                    isActive
                      ? mapMode === "globe" && tab.id === "colorful"
                        ? "bg-gradient-to-r from-sky-200 via-emerald-200 to-amber-200 text-slate-950 shadow-[0_10px_30px_rgba(148,163,184,0.18)]"
                        : "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                      : "bg-white/5 text-slate-100 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
