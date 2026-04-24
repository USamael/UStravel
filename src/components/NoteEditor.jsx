import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { calculateDuration, formatTravelDateRange } from "../utils/travel";
import { Input, TextArea } from "./ui";

export default function NoteEditor({
  activeCity,
  activeCountry,
  activeNotePanel,
  activeOriginCityName,
  countryNameDraft,
  groupedCountries,
  handleCityNoteSave,
  handleCountryNoteSave,
  handleCountryRename,
  handleDeletePhoto,
  handleEditCity,
  handlePhotoUpload,
  setActiveNotePanel,
  setCountryNameDraft,
  travelState
}) {
  const photoInputRef = useRef(null);
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const titleIdRef = useRef(`note-panel-title-${Math.random().toString(36).slice(2, 9)}`);
  const descriptionIdRef = useRef(`note-panel-desc-${Math.random().toString(36).slice(2, 9)}`);
  const previousFocusRef = useRef(null);
  const dragY = useMotionValue(0);
  const activeCityDuration = activeCity ? calculateDuration(activeCity.arrivalDate, activeCity.departureDate) : null;
  const closePanel = () => setActiveNotePanel(null);

  useEffect(() => {
    if (!activeNotePanel) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePanel();
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
          return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [activeNotePanel]);

  return (
    <AnimatePresence>
      {activeNotePanel ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={closePanel}
            className="fixed inset-0 z-[1200] bg-slate-950/44 backdrop-blur-[4px]"
          />
          <motion.aside
            ref={panelRef}
            initial={{ opacity: 0, y: 48, scale: 0.965, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 36, scale: 0.975, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.9 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleIdRef.current}
            aria-describedby={descriptionIdRef.current}
            drag="y"
            dragListener
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.22 }}
            dragMomentum={false}
            style={{ y: dragY }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 900) {
                closePanel();
                return;
              }

              dragY.set(0);
            }}
            className="fixed inset-x-3 bottom-3 z-[1300] max-h-[85vh] overflow-hidden rounded-[30px] border border-white/12 bg-[#0f1722] shadow-[0_30px_90px_rgba(2,6,23,0.58)] md:inset-x-auto md:right-4 md:top-4 md:bottom-4 md:w-[440px] lg:right-5 lg:w-[460px]"
          >
            <div className="flex h-full flex-col">
              <div className="sticky top-0 z-10 overflow-hidden border-b border-white/10 bg-[#111a26] px-4 py-4 md:px-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.14),transparent_56%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_42%)]" />
                <div className="relative mb-4 flex justify-center md:hidden">
                  <div className="h-1.5 w-14 rounded-full bg-white/28" />
                </div>
                <div className="mb-3 flex items-start justify-between gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.32 }}
                    className="min-w-0"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                      {activeCity ? "Sehir Karti" : "Ulke Karti"}
                    </p>
                    <h2 id={titleIdRef.current} className="mt-2 truncate font-display text-[2rem] text-white">
                      {activeCity ? activeCity.name : activeCountry}
                    </h2>
                    <p id={descriptionIdRef.current} className="mt-1 text-sm font-medium text-slate-300">
                      {activeCity
                        ? `${formatTravelDateRange(activeCity.arrivalDate, activeCity.departureDate)} (${activeCityDuration.label})`
                        : "Ulke notu ve genel baglam"}
                    </p>
                  </motion.div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closePanel}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-lg text-white transition hover:bg-white/12"
                    aria-label="Popup kapat"
                  >
                    ×
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.34 }}
                  className="flex flex-wrap gap-2"
                >
                  {activeCity ? (
                    <>
                      <span className="rounded-2xl border border-teal-300/28 bg-teal-300/12 px-3 py-2 text-xs font-semibold text-teal-100">
                        {activeCity.country}
                      </span>
                      <span className="rounded-2xl border border-white/12 bg-white/7 px-3 py-2 text-xs font-semibold text-slate-100">
                        {activeCityDuration.label}
                      </span>
                    </>
                  ) : (
                    <span className="rounded-2xl border border-white/12 bg-white/7 px-3 py-2 text-xs font-semibold text-slate-100">
                      {(groupedCountries[activeCountry]?.length || 0) + " kayitli sehir"}
                    </span>
                  )}
                </motion.div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {activeCity ? (
                    <button
                      type="button"
                      onClick={() => handleEditCity(activeCity)}
                      className="min-h-11 rounded-2xl border border-teal-300/22 bg-teal-300/12 px-4 text-sm font-semibold text-teal-50 transition hover:bg-teal-300/18"
                    >
                      Sehri duzenle
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={closePanel}
                    className="min-h-11 rounded-2xl border border-white/12 bg-slate-900/96 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                  >
                    Kapat
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.36 }}
                className="flex-1 overflow-y-auto bg-[#111922] px-4 py-4 md:px-5"
              >
                {activeCity ? (
                  <div className="space-y-4">
                    <TextArea
                      label="Sehir notu"
                      value={activeCity.note || ""}
                      onChange={(event) => handleCityNoteSave(activeCity.id, event.target.value)}
                      placeholder="Enerjiyi, yemekleri, havayi, insanlari ya da bir sonraki fikrinizi yazin."
                    />

                    <section className="rounded-[24px] border border-white/12 bg-[#17212b] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Fotograflar</p>
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="min-h-10 rounded-2xl border border-white/12 bg-white/7 px-4 text-sm font-semibold text-white transition hover:bg-white/12"
                        >
                          Fotograf ekle
                        </button>
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {(activeCity.photos || []).map((photo) => (
                          <div key={photo.id} className="overflow-hidden rounded-[22px] border border-white/12 bg-[#111922]">
                            <img src={photo.src} alt={photo.name} className="h-28 w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(activeCity.id, photo.id)}
                              className="w-full border-t border-white/10 px-3 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/12"
                            >
                              Fotografi sil
                            </button>
                          </div>
                        ))}
                        {(activeCity.photos || []).length === 0 ? (
                          <p className="col-span-2 rounded-[22px] border border-dashed border-white/14 bg-[#111922] p-4 text-sm text-slate-200">
                            Bu sehir icin henuz fotograf eklenmedi.
                          </p>
                        ) : null}
                      </div>
                    </section>

                    <section className="rounded-[24px] border border-white/12 bg-[#17212b] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Baglam</p>
                      <div className="mt-3 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                        <div className="rounded-[20px] border border-white/12 bg-[#111922] p-3">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Ulke</p>
                          <p className="mt-2 text-base font-medium text-white">{activeCity.country}</p>
                        </div>
                        <div className="rounded-[20px] border border-white/12 bg-[#111922] p-3">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Kalis</p>
                          <p className="mt-2 text-base font-medium text-white">{activeCityDuration.label}</p>
                        </div>
                        <div className="rounded-[20px] border border-white/12 bg-[#111922] p-3">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Rota</p>
                          <p className="mt-2 text-base font-medium text-white">
                            {activeOriginCityName || "Baslangic noktasi"}
                          </p>
                        </div>
                        <div className="rounded-[20px] border border-white/12 bg-[#111922] p-3">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Koordinatlar</p>
                          <p className="mt-2 text-base font-medium text-white">
                            {activeCity.lat.toFixed(4)}, {activeCity.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <section className="rounded-[24px] border border-white/12 bg-[#17212b] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <Input
                        label="Ulke adi"
                        value={countryNameDraft}
                        onChange={(event) => setCountryNameDraft(event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleCountryRename(activeCountry)}
                        className="mt-3 min-h-11 rounded-2xl border border-white/12 bg-white/7 px-4 text-sm font-semibold text-white transition hover:bg-white/12"
                      >
                        Ulke adini kaydet
                      </button>
                    </section>

                    <TextArea
                      label="Ulke notu"
                      value={travelState.countryNotes[activeCountry] || ""}
                      onChange={(event) => handleCountryNoteSave(activeCountry, event.target.value)}
                      placeholder="Ulkenin genel hissini ve izlenimlerinizi yazin."
                    />

                    <section className="rounded-[24px] border border-white/12 bg-[#17212b] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Baglam</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-200">
                        <p>Kayitli sehir sayisi: {groupedCountries[activeCountry]?.length || 0}</p>
                        <p>Baglami degistirmek icin haritadaki ya da listedeki bir sehre dokunun.</p>
                      </div>
                    </section>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
