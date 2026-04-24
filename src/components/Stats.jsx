import { SectionCard } from "./ui";

function StatTile({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

export default function Stats({ totalRouteDistance, totalTravelDays, worldPercent, citySurfacePercent, wishlistCount }) {
  return (
    <SectionCard title="Istatistikler" detail="Rotalarindan uretilen hizli ozetler.">
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Toplam Mesafe" value={`${Math.round(totalRouteDistance).toLocaleString("tr-TR")} km`} />
        <StatTile label="Toplam Seyahat Suresi" value={`${totalTravelDays.toLocaleString("tr-TR")} gün`} />
        <StatTile label="Dunya Yuzdesi" value={`%${worldPercent.toFixed(1)}`} />
        <StatTile label="Sehir Alani" value={`%${citySurfacePercent.toFixed(2)}`} />
        <StatTile label="Wishlist" value={wishlistCount} />
      </div>
    </SectionCard>
  );
}
