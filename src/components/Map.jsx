import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import FlatMap from "./FlatMap";
import MapErrorBoundary from "./MapErrorBoundary";
import MapToolbar from "./MapToolbar";

const GlobeMap = lazy(() => import("./GlobeMap"));

export default function TravelMap({
  activeCity,
  arcSets,
  catalog,
  cities,
  globeTheme,
  handleFocusCity,
  mapStyle,
  selectedLatLng,
  setGlobeTheme,
  setMapInstance,
  setMapStyle,
  setSelectedLatLng
}) {
  const [mapMode, setMapMode] = useState("globe");
  const [isHintVisible, setIsHintVisible] = useState(true);
  const activeGlobeThemeLabel = useMemo(
    () => (globeTheme === "night" ? "Gece Atlası" : "Renkli Küre"),
    [globeTheme]
  );

  useEffect(() => {
    setIsHintVisible(true);

    const timeoutId = window.setTimeout(() => {
      setIsHintVisible(false);
    }, 15000);

    return () => window.clearTimeout(timeoutId);
  }, [mapMode, globeTheme]);

  return (
    <main className="relative min-h-[54vh] flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/30 shadow-glow backdrop-blur-2xl md:min-h-[68vh] min-[880px]:h-full min-[880px]:min-h-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.10),transparent_24%)]" />
      <div
        className={`absolute left-4 right-4 top-4 z-[500] max-w-[min(24rem,calc(100%-2rem))] rounded-3xl border border-white/10 bg-slate-950/72 px-4 py-3 backdrop-blur-xl transition duration-500 md:right-auto md:max-w-[min(36rem,calc(100%-2rem-25rem))] ${
          isHintVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          {mapMode === "globe" ? "Kure Gorunumu" : "Rota Gorunumu"}
        </p>
        <p className="mt-2 font-display text-lg text-white">
          {mapMode === "globe"
            ? `${activeGlobeThemeLabel} ile dunyayi cevir, rotalara dokun ve gezilen sehirleri kure uzerinde kesfet`
            : "Referans sehirler soluk gorunur, gezip gordukleriniz alan ve rota vurgusuyla one cikar"}
        </p>
      </div>

      <MapToolbar
        globeTheme={globeTheme}
        mapMode={mapMode}
        mapStyle={mapStyle}
        setGlobeTheme={setGlobeTheme}
        setMapMode={setMapMode}
        setMapStyle={setMapStyle}
      />

      {mapMode === "globe" ? (
        <MapErrorBoundary resetKey={`${mapMode}:${globeTheme}:${mapStyle}`}>
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/24">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-slate-200 backdrop-blur-xl">
                  Kure motoru yukleniyor...
                </div>
              </div>
            }
          >
            <GlobeMap
              activeCity={activeCity}
              arcSets={arcSets}
              catalog={catalog}
              cities={cities}
              globeTheme={globeTheme}
              handleFocusCity={handleFocusCity}
              mapStyle={mapStyle}
              selectedLatLng={selectedLatLng}
              setMapInstance={setMapInstance}
              setSelectedLatLng={setSelectedLatLng}
            />
          </Suspense>
        </MapErrorBoundary>
      ) : (
        <FlatMap
          activeCity={activeCity}
          arcSets={arcSets}
          catalog={catalog}
          cities={cities}
          handleFocusCity={handleFocusCity}
          mapStyle={mapStyle}
          selectedLatLng={selectedLatLng}
          setMapInstance={setMapInstance}
          setSelectedLatLng={setSelectedLatLng}
        />
      )}
    </main>
  );
}
