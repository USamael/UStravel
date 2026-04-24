import { useEffect, useState } from "react";
import { loadState, saveState, starterState } from "../utils/travel";
import { firstOpenCountry } from "../utils/travelState";

export function useTravelStore() {
  const [travelState, setTravelState] = useState(starterState);
  const [isReady, setIsReady] = useState(false);
  const [storageStatus, setStorageStatus] = useState("idle");
  const [openCountry, setOpenCountry] = useState("Turkey");
  const [activeNotePanel, setActiveNotePanel] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    loadState().then((nextState) => {
      if (isCancelled) {
        return;
      }

      setTravelState(nextState);
      setOpenCountry(firstOpenCountry(nextState));
      setIsReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isCancelled = false;

    saveState(travelState).then((didPersist) => {
      if (isCancelled) {
        return;
      }

      setStorageStatus(didPersist ? "saved" : "error");
    });

    return () => {
      isCancelled = true;
    };
  }, [isReady, travelState]);

  useEffect(() => {
    if (storageStatus === "error") {
      window.alert("Veriler cihaza kaydedilemedi. Lutfen depolama alanini kontrol edip tekrar deneyin.");
    }
  }, [storageStatus]);

  return {
    activeNotePanel,
    isReady,
    openCountry,
    setActiveNotePanel,
    setOpenCountry,
    setStorageStatus,
    setTravelState,
    storageStatus,
    travelState
  };
}
