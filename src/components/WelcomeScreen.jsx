import { motion } from "framer-motion";

export default function WelcomeScreen({ totalCities, totalCountries, totalTravelDays, onEnter }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Seyahat günlüğüne gir"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={onEnter}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onEnter();
        }
      }}
      className="fixed inset-0 z-[2000] flex cursor-pointer items-center justify-center overflow-hidden bg-[#050816] text-slate-100 outline-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.30),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.22),transparent_26%),linear-gradient(140deg,#050816_0%,#07111f_46%,#020617_100%)]" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-5 grid w-full max-w-6xl gap-8 rounded-[42px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="flex min-h-[52vh] flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/35 p-6 md:p-8">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-sm font-semibold text-teal-100">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-300 shadow-[0_0_20px_rgba(94,234,212,0.8)]" />
              Tablet odakli seyahat gunlugu
            </div>

            <h1 className="max-w-3xl font-display text-5xl leading-[0.95] text-white md:text-7xl lg:text-8xl">
              Seyahat Günlüğüm
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Rotalarini, kalis surelerini, notlarini ve gitmek istedigin yerleri tek bir harita uzerinde takip et.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sehir</p>
              <p className="mt-2 font-display text-3xl text-white">{totalCities}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Ulke</p>
              <p className="mt-2 font-display text-3xl text-white">{totalCountries}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Gun</p>
              <p className="mt-2 font-display text-3xl text-white">{totalTravelDays}</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[52vh] overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-10 top-16 h-40 w-40 rounded-full border border-teal-300/20" />
            <div className="absolute right-12 top-24 h-24 w-24 rounded-full border border-amber-300/20" />
            <div className="absolute bottom-20 left-16 h-28 w-28 rounded-full border border-rose-300/20" />
          </div>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 520" fill="none" aria-hidden="true">
            <path
              d="M64 352C128 244 205 204 284 241C360 276 407 213 462 115"
              stroke="#5eead4"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="18 18"
            />
            <path
              d="M80 392C150 303 220 277 291 315C358 351 416 305 466 236"
              stroke="#fbbf24"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="4 18"
            />
            {[
              [92, 346, "#e2e8f0"],
              [183, 260, "#5eead4"],
              [284, 241, "#e2e8f0"],
              [382, 235, "#fbbf24"],
              [462, 115, "#e2e8f0"],
              [466, 236, "#fbbf24"]
            ].map(([cx, cy, color]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="11" fill={color} stroke="#0f172a" strokeWidth="5" />
            ))}
          </svg>

          <div className="relative z-10 flex h-full flex-col justify-end">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="self-start rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Baslamak icin</p>
              <p className="mt-3 font-display text-3xl text-white">Ekrana dokun</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
                Harita, not paneli ve seyahat istatistikleri hemen acilacak.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
