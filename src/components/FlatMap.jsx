import { Fragment, useEffect, useState } from "react";
import { Circle, CircleMarker, MapContainer, Pane, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_STYLES, WORLD_BOUNDS, getVisitedCityAreaRadius } from "../utils/travel";

function MapClickCapture({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng);
    }
  });

  return null;
}

function MapViewportGuard() {
  const map = useMap();

  useEffect(() => {
    const keepWorldReadable = () => {
      const boundsZoom = map.getBoundsZoom(WORLD_BOUNDS, true);
      const nextMinZoom = Math.max(2, boundsZoom);
      map.setMinZoom(nextMinZoom);

      if (map.getZoom() < nextMinZoom) {
        map.setZoom(nextMinZoom);
      }
    };

    keepWorldReadable();
    map.on("resize", keepWorldReadable);

    return () => {
      map.off("resize", keepWorldReadable);
    };
  }, [map]);

  return null;
}

function RoutePulse({ arc, color }) {
  const [pointIndex, setPointIndex] = useState(0);

  useEffect(() => {
    if (!arc.length) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setPointIndex((current) => (current + 1) % arc.length);
    }, 120);

    return () => window.clearInterval(intervalId);
  }, [arc]);

  const point = arc[pointIndex];

  if (!point) {
    return null;
  }

  return (
    <CircleMarker
      center={point}
      radius={4}
      interactive={false}
      pathOptions={{
        color,
        fillColor: "#ffffff",
        fillOpacity: 0.95,
        opacity: 0.95,
        weight: 2
      }}
    />
  );
}

export default function FlatMap({
  activeCity,
  arcSets,
  catalog,
  cities,
  handleFocusCity,
  mapStyle,
  selectedLatLng,
  setMapInstance,
  setSelectedLatLng
}) {
  return (
    <MapContainer
      center={[25, 15]}
      zoom={2}
      minZoom={2}
      maxZoom={9}
      zoomSnap={0.25}
      zoomDelta={0.5}
      scrollWheelZoom
      className="h-full min-h-[54vh] w-full md:min-h-[68vh] min-[880px]:min-h-0"
      maxBounds={WORLD_BOUNDS}
      maxBoundsPadding={[0.08, 0.08]}
      maxBoundsViscosity={1}
      worldCopyJump={false}
      whenReady={(event) => setMapInstance(event.target)}
    >
      <TileLayer attribution={MAP_STYLES[mapStyle].attribution} url={MAP_STYLES[mapStyle].url} noWrap />
      <MapViewportGuard />
      <MapClickCapture onSelect={setSelectedLatLng} />

      <Pane name="reference-cities" style={{ zIndex: 350 }}>
        {catalog.referenceCityPoints.map((city) => (
          <CircleMarker
            key={city.key}
            center={[city.lat, city.lng]}
            radius={2.6}
            interactive={false}
            pathOptions={{
              color: "#475569",
              fillColor: "#64748b",
              fillOpacity: 0.35,
              opacity: 0.25,
              weight: 1
            }}
          />
        ))}
      </Pane>

      <Pane name="travel-arcs" style={{ zIndex: 410 }}>
        {arcSets.map((arc, index) => (
          <Fragment key={arc.key}>
            <Polyline
              positions={arc.points}
              pathOptions={{
                color: index % 2 === 0 ? "#5eead4" : "#fbbf24",
                weight: 3,
                opacity: 0.9,
                dashArray: "10 10",
                className: index % 2 === 0 ? "travel-arc travel-arc-teal" : "travel-arc travel-arc-gold"
              }}
            />
            <RoutePulse arc={arc.points} color={index % 2 === 0 ? "#5eead4" : "#fbbf24"} />
          </Fragment>
        ))}
      </Pane>

      <Pane name="visited-cities" style={{ zIndex: 460 }}>
        {cities.map((city) => {
          const isActive = activeCity?.id === city.id;

          return (
            <Fragment key={city.id}>
              <Circle
                center={[city.lat, city.lng]}
                radius={getVisitedCityAreaRadius(isActive)}
                interactive={false}
                pathOptions={{
                  color: isActive ? "#fbbf24" : "#5eead4",
                  fillColor: isActive ? "#fbbf24" : "#5eead4",
                  fillOpacity: isActive ? 0.26 : 0.18,
                  opacity: isActive ? 0.48 : 0.32,
                  weight: isActive ? 2 : 1.5
                }}
              />
              <CircleMarker
                center={[city.lat, city.lng]}
                radius={isActive ? 9 : 8}
                pathOptions={{
                  color: isActive ? "#f8fafc" : "#cbd5e1",
                  fillColor: "#e2e8f0",
                  fillOpacity: 0.92,
                  weight: 2.5
                }}
                eventHandlers={{
                  click: () => handleFocusCity(city)
                }}
              />
            </Fragment>
          );
        })}
      </Pane>

      {selectedLatLng ? (
        <CircleMarker
          center={[selectedLatLng.lat, selectedLatLng.lng]}
          radius={11}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#fb7185",
            fillOpacity: 0.72,
            weight: 2
          }}
        />
      ) : null}
    </MapContainer>
  );
}
