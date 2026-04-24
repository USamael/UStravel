import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, animate, motion, useMotionValue, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { SectionCard } from "./ui";
import { exploreDemoCountries, type CountryData } from "../data/exploreCountries";

type ExploreGlobeWidgetProps = {
  countries?: CountryData[];
  ensureCountryCitiesLoaded?: (countryCode: string) => void | Promise<void>;
  getSuggestionsForCountry?: (countryCode: string) => CitySuggestion[];
  onAddToWishlist?: (country: CountryData, reason: string) => void;
  onCitySuggestionSelect?: (country: CountryData, city: CitySuggestion) => void;
  onCountrySelected?: (country: CountryData) => void;
  onStartJourney?: (country: CountryData) => void;
  preferUnvisited?: boolean;
  size?: number;
  visitedCountryCodes?: string[];
};

type CitySuggestion = {
  countryCode: string;
  latitude: number;
  longitude: number;
  name: string;
  stateCode: string;
};

type GlobeSceneProps = {
  cameraDistance: MotionValue<number>;
  highlightAmount: MotionValue<number>;
  isAnimating: boolean;
  rotationX: MotionValue<number>;
  rotationY: MotionValue<number>;
  selectedCountry: CountryData | null;
  useFallbackSphere: boolean;
};

const TAU = Math.PI * 2;
const THREE_CLOCK_DEPRECATION_WARNING = "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";

const previousThreeConsoleFunction = THREE.getConsoleFunction?.();
THREE.setConsoleFunction?.((type, message, ...params) => {
  if (type === "warn" && message === THREE_CLOCK_DEPRECATION_WARNING) {
    return;
  }

  if (previousThreeConsoleFunction) {
    previousThreeConsoleFunction(type, message, ...params);
    return;
  }

  if (type === "error") {
    console.error(message, ...params);
  } else if (type === "warn") {
    console.warn(message, ...params);
  } else {
    console.log(message, ...params);
  }
});

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function positiveAngleDelta(current: number, target: number) {
  return ((target - current) % TAU + TAU) % TAU;
}

function clampLatitudeRotation(lat: number) {
  return THREE.MathUtils.clamp(THREE.MathUtils.degToRad(lat * 0.65 + 8), THREE.MathUtils.degToRad(-34), THREE.MathUtils.degToRad(34));
}

function createMiniEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context could not be created.");
  }

  const oceanGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  oceanGradient.addColorStop(0, "#020b17");
  oceanGradient.addColorStop(0.22, "#0a2340");
  oceanGradient.addColorStop(0.5, "#11456f");
  oceanGradient.addColorStop(0.78, "#0b3053");
  oceanGradient.addColorStop(1, "#04101d");
  context.fillStyle = oceanGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const currentFill = () => context.fill();
  const currentEllipse = context.ellipse.bind(context);

  const haze = context.createRadialGradient(
    canvas.width * 0.28,
    canvas.height * 0.24,
    20,
    canvas.width * 0.28,
    canvas.height * 0.24,
    canvas.width * 0.56
  );
  haze.addColorStop(0, "rgba(173, 232, 255, 0.22)");
  haze.addColorStop(0.45, "rgba(85, 184, 255, 0.08)");
  haze.addColorStop(1, "rgba(120, 220, 255, 0)");
  context.fillStyle = haze;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(187, 247, 255, 0.04)";
  context.lineWidth = 1;
  for (let index = 0; index <= 12; index += 1) {
    const y = (canvas.height / 12) * index;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  for (let index = 0; index <= 24; index += 1) {
    const x = (canvas.width / 24) * index;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  const landMasses = [
    { x: 0.19, y: 0.3, rx: 0.16, ry: 0.22, rotation: 0.3, colorA: "#7edb92", colorB: "#2f7f4d", lobes: 6 },
    { x: 0.28, y: 0.67, rx: 0.09, ry: 0.16, rotation: -0.18, colorA: "#74d38a", colorB: "#296f45", lobes: 5 },
    { x: 0.52, y: 0.27, rx: 0.1, ry: 0.08, rotation: 0.08, colorA: "#a6e3a1", colorB: "#518258", lobes: 5 },
    { x: 0.56, y: 0.48, rx: 0.18, ry: 0.24, rotation: -0.06, colorA: "#85d27a", colorB: "#315f2e", lobes: 7 },
    { x: 0.76, y: 0.31, rx: 0.24, ry: 0.18, rotation: 0.12, colorA: "#9ae0a8", colorB: "#497f4e", lobes: 8 },
    { x: 0.82, y: 0.68, rx: 0.11, ry: 0.08, rotation: -0.15, colorA: "#86c87d", colorB: "#3f6a39", lobes: 4 }
  ];

  const drawOrganicLand = (mass: (typeof landMasses)[number]) => {
    context.save();
    context.translate(mass.x * canvas.width, mass.y * canvas.height);
    context.rotate(mass.rotation);

    const landGradient = context.createLinearGradient(
      -mass.rx * canvas.width,
      -mass.ry * canvas.height,
      mass.rx * canvas.width,
      mass.ry * canvas.height
    );
    landGradient.addColorStop(0, mass.colorA);
    landGradient.addColorStop(0.45, "#5da86b");
    landGradient.addColorStop(1, mass.colorB);
    context.fillStyle = landGradient;

    context.beginPath();
    for (let index = 0; index <= mass.lobes; index += 1) {
      const t = (index / mass.lobes) * TAU;
      const radiusJitter = 0.78 + Math.sin(t * 3.1) * 0.12 + Math.cos(t * 2.4) * 0.08;
      const px = Math.cos(t) * mass.rx * canvas.width * radiusJitter;
      const py = Math.sin(t) * mass.ry * canvas.height * (0.86 + Math.cos(t * 2.7) * 0.08);

      if (index === 0) {
        context.moveTo(px, py);
      } else {
        context.quadraticCurveTo(px * 1.06, py * 1.06, px, py);
      }
    }
    currentFill();

    context.globalAlpha = 0.12;
    context.fillStyle = "#f3f7d6";
    for (let index = 0; index < 18; index += 1) {
      context.beginPath();
      currentEllipse(
        (Math.random() - 0.5) * mass.rx * canvas.width * 1.15,
        (Math.random() - 0.5) * mass.ry * canvas.height * 1.1,
        6 + Math.random() * 14,
        3 + Math.random() * 8,
        Math.random() * TAU,
        0,
        TAU
      );
      currentFill();
    }

    context.restore();
    context.globalAlpha = 1;
  };

  landMasses.forEach(drawOrganicLand);

  context.fillStyle = "rgba(255,255,255,0.05)";
  for (let index = 0; index < 1100; index += 1) {
    context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }

  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 26; index += 1) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const cloud = context.createRadialGradient(cx, cy, 4, cx, cy, 44 + Math.random() * 34);
    cloud.addColorStop(0, "rgba(255,255,255,0.22)");
    cloud.addColorStop(0.55, "rgba(255,255,255,0.08)");
    cloud.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = cloud;
    context.beginPath();
    currentEllipse(cx, cy, 34 + Math.random() * 26, 12 + Math.random() * 10, Math.random() * TAU, 0, TAU);
    currentFill();
  }
  context.globalCompositeOperation = "source-over";

  const edgeShade = context.createRadialGradient(
    canvas.width * 0.54,
    canvas.height * 0.5,
    canvas.width * 0.16,
    canvas.width * 0.54,
    canvas.height * 0.5,
    canvas.width * 0.58
  );
  edgeShade.addColorStop(0.6, "rgba(0,0,0,0)");
  edgeShade.addColorStop(0.88, "rgba(0,0,0,0.08)");
  edgeShade.addColorStop(1, "rgba(0,0,0,0.24)");
  context.fillStyle = edgeShade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function countryPosition(country: CountryData | null, radius = 1.05) {
  if (!country) {
    return new THREE.Vector3(0, 0, 0);
  }

  const phi = THREE.MathUtils.degToRad(90 - country.lat);
  const theta = THREE.MathUtils.degToRad(country.lng + 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeScene({
  cameraDistance,
  highlightAmount,
  isAnimating,
  rotationX,
  rotationY,
  selectedCountry,
  useFallbackSphere
}: GlobeSceneProps) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    if (useFallbackSphere) {
      return null;
    }

    try {
      return createMiniEarthTexture();
    } catch {
      return null;
    }
  }, [useFallbackSphere]);

  useFrame((state, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.x = THREE.MathUtils.damp(globeGroupRef.current.rotation.x, rotationX.get(), 7, delta);
      globeGroupRef.current.rotation.y = THREE.MathUtils.damp(globeGroupRef.current.rotation.y, rotationY.get(), 7, delta);

      if (!isAnimating && !selectedCountry) {
        globeGroupRef.current.rotation.y += delta * 0.16;
      }
    }

    state.camera.position.set(0, 0.15, cameraDistance.get());
    state.camera.lookAt(0, 0, 0);

    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1.12 + highlightAmount.get() * 0.02);
      atmosphereRef.current.material.opacity = 0.18 + highlightAmount.get() * 0.1;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.035;
      cloudsRef.current.rotation.x = globeGroupRef.current?.rotation.x || 0;
    }

    if (markerRef.current && selectedCountry) {
      const targetPosition = countryPosition(selectedCountry, 1.03);
      markerRef.current.position.copy(targetPosition);
      markerRef.current.scale.setScalar(0.06 + highlightAmount.get() * 0.05);
      const markerMaterial = markerRef.current.material as THREE.MeshBasicMaterial;
      markerMaterial.opacity = 0.65 + highlightAmount.get() * 0.35;
    }

    if (ringRef.current && selectedCountry) {
      const ringPosition = countryPosition(selectedCountry, 1.035);
      ringRef.current.position.copy(ringPosition);
      ringRef.current.lookAt(new THREE.Vector3(0, 0, 0));
      ringRef.current.scale.setScalar(0.5 + highlightAmount.get() * 1.1);
      const ringMaterial = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMaterial.opacity = Math.max(0, 0.8 - highlightAmount.get() * 0.6);
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4.2, 2.8, 4.6]} intensity={2.8} color="#f8fafc" />
      <directionalLight position={[-3.2, -1.2, -3.6]} intensity={0.5} color="#7dd3fc" />
      <pointLight position={[0, 0, 3.2]} intensity={0.28} color="#dbeafe" />

      <group ref={globeGroupRef}>
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          {texture ? (
            <meshStandardMaterial
              map={texture}
              roughness={0.88}
              metalness={0.03}
              emissive="#03111d"
              emissiveIntensity={0.16}
            />
          ) : (
            <meshStandardMaterial color="#76d5ff" wireframe={useFallbackSphere} roughness={0.85} metalness={0.05} />
          )}
        </mesh>

        <mesh ref={cloudsRef} scale={1.022}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhongMaterial
            color="#f8fbff"
            emissive="#cfe8ff"
            emissiveIntensity={0.08}
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={atmosphereRef} scale={1.12}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhongMaterial
            color="#7dd3fc"
            emissive="#38bdf8"
            emissiveIntensity={0.72}
            opacity={0.2}
            transparent
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {selectedCountry ? (
          <>
            <mesh ref={markerRef}>
              <sphereGeometry args={[0.06, 18, 18]} />
              <meshBasicMaterial color="#fde68a" transparent opacity={0.92} />
            </mesh>
            <mesh ref={ringRef}>
              <ringGeometry args={[0.08, 0.13, 32]} />
              <meshBasicMaterial color="#fef3c7" transparent opacity={0.75} side={THREE.DoubleSide} />
            </mesh>
          </>
        ) : null}
      </group>
    </>
  );
}

function GlobeFallback({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(148,163,184,0.45),rgba(15,23,42,0.92))]">
      <div className="absolute inset-[14%] rounded-full border border-white/20" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-white/15" />
      <div className="text-[10px] uppercase tracking-[0.3em] text-slate-300">{label}</div>
    </div>
  );
}

function buildRecommendationReason(country: CountryData, countries: CountryData[], visitedCountryCodes: string[]) {
  const visitedSet = new Set(visitedCountryCodes);
  const visitedCountries = countries.filter((item) => visitedSet.has(item.code));
  const hasVisitedRegion = visitedCountries.some((item) => item.region === country.region);

  if (!hasVisitedRegion) {
    return `Henuz ${country.region} tarafinda bir rota kaydetmedin. ${country.name} iyi bir baslangic olabilir.`;
  }

  return `${country.name}, mevcut rotalarina yeni bir ritim katabilecek guclu bir sonraki adim gibi gorunuyor.`;
}

export default function ExploreGlobeWidget({
  countries = exploreDemoCountries,
  ensureCountryCitiesLoaded,
  getSuggestionsForCountry,
  onAddToWishlist,
  onCitySuggestionSelect,
  onCountrySelected,
  onStartJourney,
  preferUnvisited = true,
  size = 112,
  visitedCountryCodes = []
}: ExploreGlobeWidgetProps) {
  const canUseWebGl = useMemo(() => supportsWebGl(), []);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "spinning" | "arrived">("idle");
  const rotationX = useMotionValue(THREE.MathUtils.degToRad(12));
  const rotationY = useMotionValue(THREE.MathUtils.degToRad(-24));
  const cameraDistance = useMotionValue(3.15);
  const highlightAmount = useMotionValue(0);
  const activeAnimations = useRef<Array<{ stop: () => void }>>([]);
  const isMountedRef = useRef(true);
  const visitedCountryCodeSet = useMemo(() => new Set(visitedCountryCodes), [visitedCountryCodes]);
  const recommendationReason = useMemo(
    () => (selectedCountry ? buildRecommendationReason(selectedCountry, countries, visitedCountryCodes) : ""),
    [countries, selectedCountry, visitedCountryCodes]
  );
  const suggestedCities = useMemo(
    () => (selectedCountry ? (getSuggestionsForCountry?.(selectedCountry.code) || []).slice(0, 3) : []),
    [getSuggestionsForCountry, selectedCountry]
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      activeAnimations.current.forEach((animation) => animation.stop());
    };
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setIsInfoVisible(false);
      return undefined;
    }

    ensureCountryCitiesLoaded?.(selectedCountry.code);
    setIsInfoVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsInfoVisible(true);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [ensureCountryCitiesLoaded, selectedCountry]);

  function pickCountry() {
    const filteredCountries =
      preferUnvisited && visitedCountryCodeSet.size > 0
        ? countries.filter((country) => !visitedCountryCodeSet.has(country.code))
        : countries;

    const pool = filteredCountries.length > 0 ? filteredCountries : countries;
    return pool[Math.floor(Math.random() * pool.length)] || null;
  }

  async function handleExploreClick() {
    if (isAnimating) {
      return;
    }

    const nextCountry = pickCountry();

    if (!nextCountry) {
      return;
    }

    setIsAnimating(true);
    setStatus("spinning");
    setSelectedCountry(null);
    setIsInfoVisible(false);
    activeAnimations.current.forEach((animation) => animation.stop());
    activeAnimations.current = [];
    highlightAmount.set(0);

    const currentY = rotationY.get();
    const currentX = rotationX.get();
    const fastSpinTarget = currentY + TAU * 1.8;
    const countryTargetY = -THREE.MathUtils.degToRad(nextCountry.lng);
    const finalRotationY = fastSpinTarget + TAU * 1.45 + positiveAngleDelta(fastSpinTarget, countryTargetY);
    const finalRotationX = clampLatitudeRotation(nextCountry.lat);

    activeAnimations.current.push(
      animate(rotationY, fastSpinTarget, {
        duration: 0.55,
        ease: "linear"
      }),
      animate(rotationX, currentX - THREE.MathUtils.degToRad(6), {
        duration: 0.55,
        ease: [0.2, 0.9, 0.3, 1]
      }),
      animate(cameraDistance, 3.75, {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      })
    );

    await Promise.all(activeAnimations.current.map((animation) => animation));
    if (!isMountedRef.current) {
      return;
    }

    activeAnimations.current = [
      animate(rotationY, finalRotationY, {
        duration: 1.75,
        ease: [0.16, 1, 0.3, 1]
      }),
      animate(rotationX, finalRotationX, {
        duration: 1.75,
        ease: [0.16, 1, 0.3, 1]
      }),
      animate(cameraDistance, 2.45, {
        duration: 1.75,
        ease: [0.16, 1, 0.3, 1]
      })
    ];

    await Promise.all(activeAnimations.current.map((animation) => animation));
    if (!isMountedRef.current) {
      return;
    }

    setSelectedCountry(nextCountry);
    setStatus("arrived");
    onCountrySelected?.(nextCountry);

    activeAnimations.current = [
      animate(highlightAmount, 1, {
        duration: 0.42,
        ease: [0.19, 1, 0.22, 1]
      })
    ];

    await Promise.all(activeAnimations.current.map((animation) => animation));
    if (!isMountedRef.current) {
      return;
    }

    activeAnimations.current = [
      animate(highlightAmount, 0.18, {
        duration: 0.9,
        ease: "easeOut"
      })
    ];

    await Promise.all(activeAnimations.current.map((animation) => animation));
    if (!isMountedRef.current) {
      return;
    }
    setIsAnimating(false);
  }

  return (
    <SectionCard
      title="Explore"
      detail="Yeni bir yolculuk fikri icin kureyi cevirmeyi dene."
      className="overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(6,11,24,0.96))]"
    >
      <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_80%_74%,rgba(251,191,36,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
        <div className="relative flex min-h-[328px] flex-col items-center justify-start gap-5 pt-2 text-center">
          <button
            type="button"
            onClick={handleExploreClick}
            disabled={isAnimating}
            className="group relative shrink-0 self-center rounded-[30px] border border-white/12 bg-white/[0.06] p-3 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl transition hover:border-sky-200/30 hover:bg-white/[0.09] disabled:cursor-wait"
            style={{ width: size + 26, height: size + 26 }}
            aria-label={
              selectedCountry
                ? `${selectedCountry.name} secili. Yeni bir yolculuk icin kureyi yeniden cevir.`
                : "Rastgele bir ulke kesfetmek icin mini kureyi cevir"
            }
          >
            <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.16),transparent_62%)] opacity-90 transition group-hover:scale-105" />
            <div
              className="relative overflow-hidden rounded-full border border-white/12 bg-slate-950/70"
              style={{ width: size, height: size }}
            >
              {canUseWebGl ? (
                <Canvas
                  dpr={[1, 1.5]}
                  gl={{ alpha: true, antialias: true }}
                  camera={{ fov: 28, near: 0.1, far: 100, position: [0, 0.15, 3.15] }}
                  style={{ width: "100%", height: "100%", pointerEvents: "none" }}
                >
                  <GlobeScene
                    cameraDistance={cameraDistance}
                    highlightAmount={highlightAmount}
                    isAnimating={isAnimating}
                    rotationX={rotationX}
                    rotationY={rotationY}
                    selectedCountry={selectedCountry}
                    useFallbackSphere={false}
                  />
                </Canvas>
              ) : (
                <GlobeFallback label="Explore" />
              )}
            </div>
          </button>

          <div className="w-full min-w-0 px-2 pb-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {status === "spinning" ? "Yolculuk Seciliyor" : "Seyahat Secici"}
            </p>
            <p className="mt-2 font-display text-lg leading-tight text-white">
              {status === "spinning" ? "Yeni rota aranıyor..." : "Kureyi cevir, yeni bir ulkeye in."}
            </p>
            <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-6 text-slate-300">
              Mini kure bu kez sadece ilham vermiyor; secilen ulkeyi planina cevirmek icin hizli aksiyonlar sunuyor.
            </p>

            <motion.div
              initial={false}
              animate={{
                opacity: selectedCountry ? 1 : 0.45,
                y: selectedCountry ? 0 : 6
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 min-h-[112px] pb-2"
            >
              {selectedCountry ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Onerilen Rota</p>
                    <p className="mt-2 flex items-center justify-center gap-2 font-display text-2xl text-white">
                      <span>{selectedCountry.flag}</span>
                      <span className="truncate">{selectedCountry.name}</span>
                    </p>
                    <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-6 text-slate-300">{recommendationReason}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onAddToWishlist?.(selectedCountry, recommendationReason)}
                      className="min-h-11 rounded-2xl bg-amber-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                    >
                      Wishlist'e ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartJourney?.(selectedCountry)}
                      className="min-h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Yeni seyahat baslat
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isInfoVisible ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-[24px] border border-white/10 bg-slate-950/52 p-4 text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Kisa Bilgi</p>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-200">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Baskent</p>
                            <p className="mt-2 text-white">{selectedCountry.capital}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Para Birimi</p>
                            <p className="mt-2 text-white">{selectedCountry.currency}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Dil</p>
                            <p className="mt-2 text-white">{selectedCountry.language}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Mevsim Notu</p>
                            <p className="mt-2 text-white">{selectedCountry.season}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Demo sehir onerileri</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {suggestedCities.length > 0 ? (
                              suggestedCities.map((city) => (
                                <button
                                  key={`${selectedCountry.code}-${city.name}-${city.latitude}-${city.longitude}`}
                                  type="button"
                                  onClick={() => onCitySuggestionSelect?.(selectedCountry, city)}
                                  className="min-h-10 rounded-2xl border border-teal-300/20 bg-teal-300/10 px-3 text-sm font-medium text-teal-100 transition hover:bg-teal-300/18"
                                >
                                  {city.name}
                                </button>
                              ))
                            ) : (
                              <p className="text-sm text-slate-400">Sehir onerileri yukleniyor veya bu ulke icin hazir veri bulunmuyor.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Hazir</p>
                  <p className="mt-2 text-sm text-slate-300">Rastgele bir ulke secmek ve hizli aksiyonlari gormek icin kureye dokun.</p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export type { CountryData };
