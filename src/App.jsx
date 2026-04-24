import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import TravelMap from "./components/Map";
import NoteEditor from "./components/NoteEditor";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import { useTravelData } from "./hooks/useTravelData";

function App() {
  const travel = useTravelData();
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div className="tablet-app-shell min-h-screen bg-aurora-grid text-slate-100 min-[880px]:h-dvh min-[880px]:overflow-hidden">
      <motion.div
        animate={{
          opacity: hasEntered ? 1 : 0.42,
          scale: hasEntered ? 1 : 0.985,
          filter: hasEntered ? "blur(0px)" : "blur(6px)"
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex min-h-screen max-w-[1880px] flex-col gap-4 p-3 md:gap-5 md:p-4 min-[880px]:h-[calc(100dvh-2.5rem)] min-[880px]:min-h-0 min-[880px]:flex-row min-[880px]:overflow-hidden min-[880px]:p-5"
      >
        <div className="order-1 md:order-2 min-[880px]:order-1 min-[880px]:h-full min-[880px]:min-h-0 min-[880px]:flex-none">
          <Sidebar travel={travel} />
        </div>
        <div className="order-2 flex min-h-[54vh] min-w-0 flex-1 md:order-1 md:min-h-[68vh] min-[880px]:order-2 min-[880px]:h-full min-[880px]:min-h-0">
          <TravelMap
            activeCity={travel.activeCity}
            arcSets={travel.arcSets}
            catalog={travel.catalog}
            cities={travel.travelState.cities}
            globeTheme={travel.globeTheme}
            handleFocusCity={travel.handleFocusCity}
            mapStyle={travel.mapStyle}
            selectedLatLng={travel.selectedLatLng}
            setGlobeTheme={travel.setGlobeTheme}
            setMapInstance={travel.setMapInstance}
            setMapStyle={travel.setMapStyle}
            setSelectedLatLng={travel.setSelectedLatLng}
          />
        </div>
      </motion.div>

      <NoteEditor
        activeCity={travel.activeCity}
        activeCountry={travel.activeCountry}
        activeNotePanel={travel.activeNotePanel}
        activeOriginCityName={travel.activeOriginCityName}
        countryNameDraft={travel.countryNameDraft}
        groupedCountries={travel.groupedCountries}
        handleCityNoteSave={travel.handleCityNoteSave}
        handleCountryNoteSave={travel.handleCountryNoteSave}
        handleCountryRename={travel.handleCountryRename}
        handleDeletePhoto={travel.handleDeletePhoto}
        handleEditCity={travel.handleEditCity}
        handlePhotoUpload={travel.handlePhotoUpload}
        setActiveNotePanel={travel.setActiveNotePanel}
        setCountryNameDraft={travel.setCountryNameDraft}
        travelState={travel.travelState}
      />

      <AnimatePresence>
        {!hasEntered ? (
          <WelcomeScreen
            totalCities={travel.totalCities}
            totalCountries={travel.totalCountries}
            totalTravelDays={travel.totalTravelDays}
            onEnter={() => setHasEntered(true)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default App;
