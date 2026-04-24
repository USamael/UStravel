import { Input, SearchableSelect, SectionCard, TextArea } from "./ui";

export default function Wishlist({
  ensureCatalogLoaded,
  handleWishlistCountryQueryChange,
  handleWishlistCountrySelect,
  handleWishlistDelete,
  handleWishlistEdit,
  handleWishlistSubmit,
  resetWishlistDraft,
  setWishlistDraft,
  sortedWishlist,
  wishlistCountryOptions,
  wishlistCountryQuery,
  wishlistDraft
}) {
  return (
    <SectionCard title="Gelecek Seyahatler" detail="Gitmek istediginiz ulkeleri siralayin ve planinizi gorunur tutun.">
      <form className="space-y-3" onSubmit={handleWishlistSubmit}>
        <SearchableSelect
          label="Ulke"
          placeholder="Ulke ara veya listeden sec"
          query={wishlistCountryQuery}
          selectedValue={wishlistDraft.country}
          options={wishlistCountryOptions}
          onOpen={ensureCatalogLoaded}
          emptyMessage="Aramaniza uyan ulke bulunamadi."
          onQueryChange={handleWishlistCountryQueryChange}
          onSelect={handleWishlistCountrySelect}
          renderOption={(option) => (
            <>
              <span className="font-medium">{option.title}</span>
              <span className="text-xs text-slate-400">{option.subtitle}</span>
            </>
          )}
        />
        <Input
          label="Sira"
          type="number"
          min="1"
          placeholder="1"
          value={wishlistDraft.rank}
          onChange={(event) => setWishlistDraft({ ...wishlistDraft, rank: event.target.value })}
        />
        <TextArea
          label="Neden sirada"
          placeholder="Bu destinasyon neden su anda onemli?"
          value={wishlistDraft.note}
          onChange={(event) => setWishlistDraft({ ...wishlistDraft, note: event.target.value })}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="min-h-12 flex-1 rounded-2xl bg-amber-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            {wishlistDraft.id ? "Liste ogesini kaydet" : "Listeye ekle"}
          </button>
          <button
            type="button"
            onClick={resetWishlistDraft}
            className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Temizle
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-2">
        {sortedWishlist.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base text-white">
                  #{entry.rank} {entry.country}
                </p>
                <p className="mt-1 text-sm text-slate-400">{entry.note || "Henuz not yok."}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleWishlistEdit(entry)}
                  className="min-h-10 rounded-2xl border border-white/10 px-3 text-sm text-white transition hover:bg-white/10"
                >
                  Duzenle
                </button>
                <button
                  type="button"
                  onClick={() => handleWishlistDelete(entry.id)}
                  className="min-h-10 rounded-2xl border border-rose-400/20 px-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
