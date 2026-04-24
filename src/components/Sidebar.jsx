import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useRef } from "react";
import { useState } from "react";
import { calculateDuration, getCitiesForCountry } from "../utils/travel";
import Stats from "./Stats";
import TravelSummary from "./TravelSummary";
import TravelTimeline from "./TravelTimeline";
import Wishlist from "./Wishlist";
import { DateInput, Input, SearchableSelect, SectionCard, TextArea } from "./ui";

const ExploreGlobeWidget = lazy(() => import("./ExploreGlobeWidget"));

export default function Sidebar({ travel }) {
  const importInputRef = useRef(null);
  const [visitedView, setVisitedView] = useState("countries");
  const {
    catalog,
    catalogStatus,
    cityCountryOptions,
    cityCountryQuery,
    cityDraft,
    cityDraftDuration,
    cityOptions,
    cityQuery,
    citySurfacePercent,
    countryNames,
    ensureCatalogLoaded,
    ensureCitiesLoaded,
    groupedCountries,
    handleCityCountryQueryChange,
    handleCityCountrySelect,
    handleCityQueryChange,
    handleCitySelect,
    handleCitySubmit,
    handleDeleteCity,
    handleDeleteCountry,
    handleEditCity,
    handleExportData,
    handleFocusCity,
    handleImportData,
    handleLoadDemoData,
    handleQuickWishlistAdd,
    handleOriginCityQueryChange,
    handleOriginCitySelect,
    handleOriginCountryQueryChange,
    handleOriginCountrySelect,
    handleExploreCitySuggestion,
    handleExploreStart,
    handleWishlistCountryQueryChange,
    handleWishlistCountrySelect,
    handleWishlistDelete,
    handleWishlistEdit,
    handleWishlistSubmit,
    openCountry,
    originCityOptions,
    originCityQuery,
    originCountryOptions,
    originCountryQuery,
    originDraft,
    resetCityDraft,
    resetWishlistDraft,
    searchQuery,
    searchedCityResults,
    setActiveNotePanel,
    setCityDraft,
    setOpenCountry,
    setSearchQuery,
    storageStatus,
    setWishlistDraft,
    sortedWishlist,
    totalCities,
    totalCountries,
    totalRouteDistance,
    totalTravelDays,
    travelState,
    visitedCountryCodes,
    wishlistCountryOptions,
    wishlistCountryQuery,
    wishlistDraft,
    worldPercent
  } = travel;

  return (
    <aside className="relative z-[800] flex w-full shrink-0 flex-col gap-6 pb-6 min-[880px]:h-full min-[880px]:max-h-full min-[880px]:min-h-0 min-[880px]:w-[380px] min-[880px]:overflow-y-scroll min-[880px]:overscroll-contain min-[880px]:pr-3 min-[1100px]:w-[420px] min-[1320px]:w-[460px]">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportData}
      />

      <SectionCard title="Seyahat Takibi" detail="Geçmiş ve gelecekteki rotalarınız için tablet odaklı seyahat paneli.">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sehirler</p>
            <p className="mt-3 font-display text-3xl text-white">{totalCities}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Ulkeler</p>
            <p className="mt-3 font-display text-3xl text-white">{totalCountries}</p>
          </div>
        </div>
        {totalCities === 0 ? (
          <button
            type="button"
            onClick={handleLoadDemoData}
            className="mt-4 min-h-14 w-full rounded-3xl border border-amber-300/30 bg-amber-300 px-5 text-sm font-bold text-slate-950 shadow-glow transition hover:bg-amber-200"
          >
            Izmir demo rotasini yukle: 15 ulke / 30 sehir
          </button>
        ) : null}
      </SectionCard>

      <Suspense
        fallback={
          <SectionCard title="Explore" detail="Yeni bir yolculuk fikri icin kureyi hazirliyoruz.">
            <div className="min-h-[360px] rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
              <div className="flex h-full min-h-[328px] items-center justify-center rounded-[24px] border border-dashed border-white/10 text-sm text-slate-400">
                Explore kuresi yukleniyor...
              </div>
            </div>
          </SectionCard>
        }
      >
        <ExploreGlobeWidget
          ensureCountryCitiesLoaded={ensureCitiesLoaded}
          getSuggestionsForCountry={(countryCode) => getCitiesForCountry(countryCode, catalog)}
          onAddToWishlist={handleQuickWishlistAdd}
          onCitySuggestionSelect={handleExploreCitySuggestion}
          onCountrySelected={(country) => {
            setWishlistDraft((current) => ({
              ...current,
              country: country.name,
              countryCode: country.code
            }));
          }}
          onStartJourney={handleExploreStart}
          visitedCountryCodes={visitedCountryCodes}
        />
      </Suspense>

      <Stats
        totalRouteDistance={totalRouteDistance}
        worldPercent={worldPercent}
        citySurfacePercent={citySurfacePercent}
        totalTravelDays={totalTravelDays}
        wishlistCount={sortedWishlist.length}
      />

      <TravelSummary cities={travelState.cities} />

      <SectionCard title="Hizli Arama" detail="Kayitli sehirler arasinda hizlica gez.">
        <Input
          label="Sehir ara"
          placeholder="Istanbul, Tokyo, Skopje..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <div className="mt-3 space-y-2">
          {searchedCityResults.slice(0, 6).map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleFocusCity(city)}
              className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-left text-sm text-white transition hover:bg-white/10"
            >
              <span>{city.name}</span>
              <span className="text-slate-400">{city.country}</span>
            </button>
          ))}
          {searchQuery && searchedCityResults.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Eslesen kayitli sehir bulunamadi.
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Yedekleme" detail="Verilerini JSON olarak disa aktar veya geri yukle.">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="min-h-12 flex-1 rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            JSON indir
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            JSON yukle
          </button>
          <button
            type="button"
            onClick={handleLoadDemoData}
            className="min-h-12 flex-1 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
          >
            Demo rota yukle
          </button>
        </div>
        <p className={`mt-3 text-xs ${storageStatus === "error" ? "text-rose-200" : "text-slate-500"}`}>
          {storageStatus === "error"
            ? "Cihaz depolamasi kaydi reddetti. Fotograflar ve son degisiklikler kalici olmayabilir."
            : "Fotograflar artik cihaz veritabanina kaydedilir; JSON yedegi ise hafif tutulur."}
        </p>
      </SectionCard>

      <SectionCard
        title={cityDraft.id ? "Duragi Duzenle" : "Sehir Ekle"}
        detail="Ulke ve sehri listeden secin. Isterseniz koordinati haritaya dokunarak da guncelleyebilirsiniz."
      >
        <form className="space-y-3" onSubmit={handleCitySubmit}>
          <SearchableSelect
            label="Ulke"
            placeholder="Ulke ara veya listeden sec"
            query={cityCountryQuery}
            selectedValue={cityDraft.country}
            options={cityCountryOptions}
            onOpen={ensureCatalogLoaded}
            emptyMessage="Aramanizla eslesen ulke bulunamadi."
            onQueryChange={handleCityCountryQueryChange}
            onSelect={handleCityCountrySelect}
            renderOption={(option) => (
              <>
                <span className="font-medium">{option.title}</span>
                <span className="text-xs text-slate-400">{option.subtitle}</span>
              </>
            )}
          />

          <SearchableSelect
            label="Sehir"
            placeholder={cityDraft.countryCode ? "Sehir ara veya listeden sec" : "Once ulke secin"}
            query={cityQuery}
            selectedValue={cityDraft.name}
            options={cityDraft.countryCode ? cityOptions : []}
            onOpen={() => ensureCitiesLoaded(cityDraft.countryCode)}
            emptyMessage={
              cityDraft.countryCode
                ? "Bu ulke icin aramaniza uyan sehir bulunamadi."
                : "Sehir listesi icin once bir ulke secin."
            }
            helperText={
              cityDraft.countryCode
                ? catalog.cityLoadStatus.get(cityDraft.countryCode) === "loading"
                  ? `${cityDraft.country} sehirleri yukleniyor...`
                  : `${cityDraft.country} icin ${getCitiesForCountry(cityDraft.countryCode, catalog).length} sehir listeleniyor.`
                : catalogStatus === "loading"
                  ? "Sehir verileri yukleniyor..."
                  : ""
            }
            onQueryChange={handleCityQueryChange}
            onSelect={handleCitySelect}
            renderOption={(option) => (
              <div className="flex w-full items-center justify-between gap-3">
                <span className="font-medium">{option.title}</span>
                <span className="text-xs text-slate-400">{option.subtitle}</span>
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Enlem"
              placeholder="37.5665"
              value={cityDraft.lat}
              onChange={(event) => setCityDraft({ ...cityDraft, lat: event.target.value })}
            />
            <Input
              label="Boylam"
              placeholder="126.9780"
              value={cityDraft.lng}
              onChange={(event) => setCityDraft({ ...cityDraft, lng: event.target.value })}
            />
          </div>
          <div className="rounded-3xl border border-teal-300/10 bg-teal-300/5 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <DateInput
                label="Giris tarihi"
                value={cityDraft.arrivalDate}
                onChange={(event) => setCityDraft({ ...cityDraft, arrivalDate: event.target.value })}
              />
              <DateInput
                label="Cikis tarihi"
                value={cityDraft.departureDate}
                min={cityDraft.arrivalDate || undefined}
                helperText="Bos birakirsaniz Devam ediyor olarak gorunur."
                onChange={(event) => setCityDraft({ ...cityDraft, departureDate: event.target.value })}
              />
            </div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Kalis suresi</p>
              <p className="mt-2 font-display text-lg text-teal-100">
                {!cityDraft.arrivalDate
                  ? "Tarih secilmedi"
                  : cityDraftDuration.isOngoing
                    ? "Devam ediyor"
                    : `Toplam ${cityDraftDuration.days} Gün`}
              </p>
              <p className="mt-1 text-sm text-slate-400">{cityDraftDuration.label}</p>
            </div>
          </div>
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Hangi sehirden geldim</p>
            <SearchableSelect
              label="Geldigim ulke"
              placeholder="Ulke ara veya listeden sec"
              query={originCountryQuery}
              selectedValue={originDraft.country}
              options={originCountryOptions}
              onOpen={ensureCatalogLoaded}
              emptyMessage="Aramanizla eslesen ulke bulunamadi."
              onQueryChange={handleOriginCountryQueryChange}
              onSelect={handleOriginCountrySelect}
              renderOption={(option) => (
                <>
                  <span className="font-medium">{option.title}</span>
                  <span className="text-xs text-slate-400">{option.subtitle}</span>
                </>
              )}
            />

            <SearchableSelect
              label="Geldigim sehir"
              placeholder={originDraft.countryCode ? "Sehir ara veya listeden sec" : "Once bir ulke secin"}
              query={originCityQuery}
              selectedValue={originDraft.name}
              options={originDraft.countryCode ? originCityOptions : []}
              onOpen={() => ensureCitiesLoaded(originDraft.countryCode)}
              emptyMessage={
                originDraft.countryCode
                  ? "Bu ulke icin aramaniza uyan sehir bulunamadi."
                  : "Sehir listesi icin once bir ulke secin."
              }
              helperText={
                originDraft.countryCode
                  ? catalog.cityLoadStatus.get(originDraft.countryCode) === "loading"
                    ? `${originDraft.country} sehirleri yukleniyor...`
                    : `${originDraft.country} icin ${getCitiesForCountry(originDraft.countryCode, catalog).length} sehir listeleniyor.`
                  : "Bu alan rota baslangicini belirler."
              }
              onQueryChange={handleOriginCityQueryChange}
              onSelect={handleOriginCitySelect}
              renderOption={(option) => (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="font-medium">{option.title}</span>
                  <span className="text-xs text-slate-400">{option.subtitle}</span>
                </div>
              )}
            />
            {cityDraft.fromCityId ? (
              <p className="text-xs text-teal-200">Bu rota mevcut kayitli bir sehirle eslesti.</p>
            ) : null}
          </div>
          <TextArea
            label="Kisa not"
            placeholder="Bu duragi sizin icin ozel yapan neydi?"
            value={cityDraft.note}
            onChange={(event) => setCityDraft({ ...cityDraft, note: event.target.value })}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="min-h-12 flex-1 rounded-2xl bg-teal-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
            >
              {cityDraft.id ? "Sehri kaydet" : "Haritaya ekle"}
            </button>
            <button
              type="button"
              onClick={resetCityDraft}
              className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Temizle
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Ziyaret Edilen Ulkeler" detail="Acilir yapi, sehirleri ulkelerine gore gruplar.">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setVisitedView("countries")}
            className={`min-h-10 rounded-2xl px-4 text-sm font-semibold transition ${
              visitedView === "countries" ? "bg-teal-200 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Ulke Listesi
          </button>
          <button
            type="button"
            onClick={() => setVisitedView("timeline")}
            className={`min-h-10 rounded-2xl px-4 text-sm font-semibold transition ${
              visitedView === "timeline" ? "bg-teal-200 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Timeline
          </button>
        </div>

        {visitedView === "timeline" ? (
          <TravelTimeline cities={travelState.cities} onFocusCity={handleFocusCity} />
        ) : (
        <div className="space-y-3">
          {countryNames.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Rota haritasini olusturmaya baslamak icin ilk sehrinizi ekleyin.
            </p>
          ) : null}

          {countryNames.map((countryName) => {
            const cities = groupedCountries[countryName];
            const isOpen = openCountry === countryName;

            return (
              <div key={countryName} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => setOpenCountry(isOpen ? "" : countryName)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div>
                    <p className="font-display text-base text-white">{countryName}</p>
                    <p className="text-sm text-slate-400">{cities.length} kayitli sehir</p>
                  </div>
                  <span className="text-sm text-slate-400">{isOpen ? "Gizle" : "Ac"}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="space-y-2 p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveNotePanel({ type: "country", country: countryName })}
                            className="min-h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
                          >
                            Ulke notu
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCountry(countryName)}
                            className="min-h-11 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                          >
                            Ulkeyi sil
                          </button>
                        </div>

                        {cities.map((city) => {
                          const duration = calculateDuration(city.arrivalDate, city.departureDate);

                          return (
                          <div key={city.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleFocusCity(city)}
                                    className="font-medium text-white transition hover:text-teal-200"
                                  >
                                    {city.name}
                                  </button>
                                  <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-2.5 py-1 text-xs font-semibold text-teal-100">
                                    {duration.badge}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-400">
                                  {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditCity(city)}
                                  className="min-h-10 rounded-2xl border border-white/10 px-3 text-sm text-white transition hover:bg-white/10"
                                >
                                  Duzenle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCity(city.id)}
                                  className="min-h-10 rounded-2xl border border-rose-400/20 px-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
                                >
                                  Sil
                                </button>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        )}
      </SectionCard>

      <Wishlist
        ensureCatalogLoaded={ensureCatalogLoaded}
        ensureCitiesLoaded={ensureCitiesLoaded}
        handleWishlistCountryQueryChange={handleWishlistCountryQueryChange}
        handleWishlistCountrySelect={handleWishlistCountrySelect}
        handleWishlistDelete={handleWishlistDelete}
        handleWishlistEdit={handleWishlistEdit}
        handleWishlistSubmit={handleWishlistSubmit}
        resetWishlistDraft={resetWishlistDraft}
        setWishlistDraft={setWishlistDraft}
        sortedWishlist={sortedWishlist}
        wishlistCountryOptions={wishlistCountryOptions}
        wishlistCountryQuery={wishlistCountryQuery}
        wishlistDraft={wishlistDraft}
      />
    </aside>
  );
}
