import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "../utils/travel";

const COLORFUL_GLOBE_STYLE_URL = "https://demotiles.maplibre.org/style.json";
const GLYPH_SOURCE_URL = "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf";
const REFERENCE_SOURCE_ID = "reference-cities";
const ROUTE_SOURCE_ID = "travel-routes";
const VISITED_SOURCE_ID = "visited-cities";
const SELECTED_SOURCE_ID = "selected-location";

function toFeatureCollection(features) {
  return {
    type: "FeatureCollection",
    features
  };
}

function routeFeature(arc, index) {
  return {
    type: "Feature",
    properties: {
      color: index % 2 === 0 ? "#5eead4" : "#fbbf24",
      glowColor: index % 2 === 0 ? "rgba(94,234,212,0.34)" : "rgba(251,191,36,0.3)"
    },
    geometry: {
      type: "LineString",
      coordinates: arc.points.map(([lat, lng]) => [lng, lat])
    }
  };
}

function getVisitedFeatures(map, point) {
  if (!map.getLayer("visited-cities")) {
    return [];
  }

  return map.queryRenderedFeatures(point, {
    layers: ["visited-cities"]
  });
}

function getThemeConfig(globeTheme, mapStyle) {
  if (globeTheme === "colorful") {
    return {
      background:
        "radial-gradient(circle at 24% 22%, rgba(56,189,248,0.18), transparent 24%), radial-gradient(circle at 75% 70%, rgba(251,191,36,0.16), transparent 26%), rgba(15,23,42,0.06)"
    };
  }

  if (mapStyle === "light") {
    return {
      background: "rgba(219,234,254,0.08)"
    };
  }

  if (mapStyle === "voyager") {
    return {
      background: "rgba(15,118,110,0.08)"
    };
  }

  return {
    background: "rgba(2,6,23,0.12)"
  };
}

function createGlobeStyle(globeTheme, mapStyle) {
  if (globeTheme === "colorful") {
    return COLORFUL_GLOBE_STYLE_URL;
  }

  const activeStyle = MAP_STYLES[mapStyle] || MAP_STYLES.dark;

  return {
    version: 8,
    glyphs: GLYPH_SOURCE_URL,
    sources: {
      basemap: {
        type: "raster",
        tiles: [
          activeStyle.url
            .replace("{s}", "a")
            .replace("{r}", "@2x")
        ],
        tileSize: 256,
        attribution: activeStyle.attribution
      }
    },
    layers: [
      {
        id: "basemap-layer",
        type: "raster",
        source: "basemap"
      }
    ]
  };
}

function syncOverlaySources(map, referenceData, routeData, cityData, selectedData) {
  if (typeof map.isStyleLoaded === "function" && !map.isStyleLoaded()) {
    return false;
  }

  if (!map.getSource(REFERENCE_SOURCE_ID)) {
    map.addSource(REFERENCE_SOURCE_ID, {
      type: "geojson",
      data: referenceData
    });
    map.addLayer({
      id: "reference-cities",
      type: "circle",
      source: REFERENCE_SOURCE_ID,
      paint: {
        "circle-radius": 1.8,
        "circle-color": "#94a3b8",
        "circle-opacity": 0.22,
        "circle-stroke-width": 0
      }
    });
  } else {
    map.getSource(REFERENCE_SOURCE_ID).setData(referenceData);
  }

  if (!map.getSource(ROUTE_SOURCE_ID)) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: routeData,
      lineMetrics: true
    });
    map.addLayer({
      id: "travel-routes-glow",
      type: "line",
      source: ROUTE_SOURCE_ID,
      paint: {
        "line-color": ["get", "glowColor"],
        "line-width": 7,
        "line-opacity": 0.3,
        "line-blur": 2
      }
    });
    map.addLayer({
      id: "travel-routes",
      type: "line",
      source: ROUTE_SOURCE_ID,
      paint: {
        "line-color": ["get", "color"],
        "line-width": 3,
        "line-opacity": 0.9,
        "line-dasharray": [1.4, 1.4]
      }
    });
  } else {
    map.getSource(ROUTE_SOURCE_ID).setData(routeData);
  }

  if (!map.getSource(VISITED_SOURCE_ID)) {
    map.addSource(VISITED_SOURCE_ID, {
      type: "geojson",
      data: cityData
    });
    map.addLayer({
      id: "visited-city-halos",
      type: "circle",
      source: VISITED_SOURCE_ID,
      paint: {
        "circle-radius": ["case", ["get", "active"], 24, 16],
        "circle-color": ["case", ["get", "active"], "#fbbf24", "#5eead4"],
        "circle-opacity": ["case", ["get", "active"], 0.22, 0.14],
        "circle-blur": 0.4
      }
    });
    map.addLayer({
      id: "visited-cities",
      type: "circle",
      source: VISITED_SOURCE_ID,
      paint: {
        "circle-radius": ["case", ["get", "active"], 8.5, 7],
        "circle-color": "#f8fafc",
        "circle-stroke-color": ["case", ["get", "active"], "#fbbf24", "#5eead4"],
        "circle-stroke-width": ["case", ["get", "active"], 3, 2.2],
        "circle-opacity": 0.96
      }
    });
    map.addLayer({
      id: "visited-city-labels",
      type: "symbol",
      source: VISITED_SOURCE_ID,
      minzoom: 2.2,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["case", ["get", "active"], 15, 12],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "symbol-sort-key": ["case", ["get", "active"], 10, 1]
      },
      paint: {
        "text-color": ["case", ["get", "active"], "#fef3c7", "#e2e8f0"],
        "text-halo-color": "rgba(2, 6, 23, 0.92)",
        "text-halo-width": 1.4,
        "text-opacity": 0.92
      }
    });
  } else {
    map.getSource(VISITED_SOURCE_ID).setData(cityData);
  }

  if (!map.getSource(SELECTED_SOURCE_ID)) {
    map.addSource(SELECTED_SOURCE_ID, {
      type: "geojson",
      data: selectedData
    });
    map.addLayer({
      id: "selected-location",
      type: "circle",
      source: SELECTED_SOURCE_ID,
      paint: {
        "circle-radius": 10,
        "circle-color": "#fb7185",
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-opacity": 0.82
      }
    });
  } else {
    map.getSource(SELECTED_SOURCE_ID).setData(selectedData);
  }

  return true;
}

export default function GlobeMap({
  activeCity,
  arcSets,
  catalog,
  cities,
  globeTheme,
  handleFocusCity,
  mapStyle,
  selectedLatLng,
  setMapInstance,
  setSelectedLatLng
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const activeCityRef = useRef(activeCity);
  const citiesRef = useRef(cities);
  const handleFocusCityRef = useRef(handleFocusCity);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);

  const referenceData = useMemo(
    () =>
      toFeatureCollection(
        catalog.referenceCityPoints.map((city) => ({
          type: "Feature",
          properties: {
            key: city.key
          },
          geometry: {
            type: "Point",
            coordinates: [city.lng, city.lat]
          }
        }))
      ),
    [catalog.referenceCityPoints]
  );

  const routeData = useMemo(() => toFeatureCollection(arcSets.map(routeFeature)), [arcSets]);

  const cityData = useMemo(
    () =>
      toFeatureCollection(
        cities.map((city) => ({
          type: "Feature",
          properties: {
            id: city.id,
            name: city.name,
            country: city.country,
            active: activeCity?.id === city.id
          },
          geometry: {
            type: "Point",
            coordinates: [city.lng, city.lat]
          }
        }))
      ),
    [activeCity?.id, cities]
  );

  const selectedData = useMemo(
    () =>
      toFeatureCollection(
        selectedLatLng
          ? [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [selectedLatLng.lng, selectedLatLng.lat]
                }
              }
            ]
          : []
      ),
    [selectedLatLng]
  );

  const markReady = () => {
    if (isReadyRef.current) {
      return;
    }

    setIsReady(true);
    isReadyRef.current = true;
  };

  useEffect(() => {
    activeCityRef.current = activeCity;
  }, [activeCity]);

  useEffect(() => {
    citiesRef.current = cities;
  }, [cities]);

  useEffect(() => {
    handleFocusCityRef.current = handleFocusCity;
  }, [handleFocusCity]);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    setIsReady(false);
    isReadyRef.current = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: createGlobeStyle(globeTheme, mapStyle),
      center: [18, 27],
      zoom: 1.4,
      minZoom: 0.8,
      maxZoom: 8,
      attributionControl: false
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

    const adapter = {
      getZoom: () => map.getZoom(),
      flyTo: ([lat, lng], zoom, options = {}) => {
        map.flyTo({
          center: [lng, lat],
          zoom,
          duration: Math.max(700, (options.duration || 1.2) * 1000),
          essential: true
        });
      }
    };

    setMapInstance(adapter);

    const applyScene = () => {
      try {
        if (typeof map.setProjection === "function") {
          map.setProjection({ type: "globe" });
        }

        const didSync = syncOverlaySources(map, referenceData, routeData, cityData, selectedData);

        if (didSync) {
          markReady();
        }
      } catch (error) {
        console.error("MapLibre Scene Error:", error);
      }
    };

    const markReadyOnRender = () => {
      markReady();
    };

    const readyTimeoutId = window.setTimeout(() => {
      if (mapRef.current && !isReadyRef.current) {
        console.warn("MapLibre ready timeout fallback used.");
        if (typeof map.isStyleLoaded === "function" && map.isStyleLoaded()) {
          applyScene();
        }
      }
    }, 4000);

    map.on("load", applyScene);
    map.on("style.load", applyScene);
    map.on("idle", markReadyOnRender);
    map.on("styledata", markReadyOnRender);
    map.on("render", markReadyOnRender);
    map.on("error", (e) => {
      console.error("MapLibre Error:", e?.error || e);
    });

    map.on("click", (event) => {
      const features = getVisitedFeatures(map, event.point);
      const cityId = features[0]?.properties?.id;
      const city = cityId ? citiesRef.current.find((item) => item.id === cityId) : null;

      if (city) {
        handleFocusCityRef.current(city);
        return;
      }

      setSelectedLatLng({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng
      });
    });

    map.on("mousemove", (event) => {
      const features = getVisitedFeatures(map, event.point);
      map.getCanvas().style.cursor = features.length ? "pointer" : "";
    });

    let animationId = window.requestAnimationFrame(function rotate() {
      if (!activeCityRef.current && map.getZoom() < 2.3 && !map.isMoving()) {
        map.rotateTo(map.getBearing() + 0.03, { duration: 0 });
      }

      animationId = window.requestAnimationFrame(rotate);
    });

    return () => {
      window.clearTimeout(readyTimeoutId);
      window.cancelAnimationFrame(animationId);
      setMapInstance(null);
      map.off("load", applyScene);
      map.off("style.load", applyScene);
      map.off("idle", markReadyOnRender);
      map.off("styledata", markReadyOnRender);
      map.off("render", markReadyOnRender);
      map.remove();
      mapRef.current = null;
      isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    setIsReady(false);
    isReadyRef.current = false;
    map.setStyle(createGlobeStyle(globeTheme, mapStyle));
  }, [globeTheme, mapStyle]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isReady) {
      return;
    }

    syncOverlaySources(map, referenceData, routeData, cityData, selectedData);
  }, [cityData, isReady, referenceData, routeData, selectedData]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isReady || !activeCity) {
      return;
    }

    map.flyTo({
      center: [activeCity.lng, activeCity.lat],
      zoom: Math.max(map.getZoom(), 3.3),
      duration: 1200,
      essential: true
    });
  }, [activeCity, isReady]);

  const themeConfig = getThemeConfig(globeTheme, mapStyle);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        style={{ background: `radial-gradient(circle at center, ${themeConfig.background}, transparent 62%)` }}
        aria-label="Kure harita"
      />
      {isReady ? (
        <>
          <div className="pointer-events-none absolute bottom-4 left-4 z-[420] max-w-xs rounded-3xl border border-white/10 bg-slate-950/62 px-4 py-3 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Kure Modu</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {activeCity
                ? `${activeCity.name}, ${activeCity.country} secili. Kure bu duraga odaklandi.`
                : `${cities.length} sehir ve ${arcSets.length} rota ${globeTheme === "colorful" ? "renkli kurede" : "gece atlasinda"} hazir.`}
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-20 z-[420] rounded-3xl border border-white/10 bg-slate-950/62 px-4 py-3 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Etkilesim</p>
            <p className="mt-2 text-sm text-slate-200">Surukle, yakinlastir, sehre dokun</p>
          </div>
        </>
      ) : null}
      {!isReady ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/24">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-slate-200 backdrop-blur-xl">
            Kure haritasi hazirlaniyor...
          </div>
        </div>
      ) : null}
    </>
  );
}
