import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export function SectionCard({ title, detail, children, className = "" }) {
  return (
    <section
      className={`relative isolate shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-glow backdrop-blur-2xl ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-white">{title}</h2>
          {detail ? <p className="mt-1 text-sm text-slate-400">{detail}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-400">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/12 bg-slate-950/92 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/20"
      />
    </label>
  );
}

export function DateInput({ label, helperText, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-400">{label}</span>
      <input
        type="date"
        {...props}
        className="min-h-14 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-base text-white outline-none transition [color-scheme:dark] focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/20"
      />
      {helperText ? <p className="mt-2 text-xs text-slate-500">{helperText}</p> : null}
    </label>
  );
}

export function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-400">{label}</span>
      <textarea
        {...props}
        className="min-h-28 w-full rounded-2xl border border-white/12 bg-[#111922] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/20"
      />
    </label>
  );
}

export function SearchableSelect({
  label,
  placeholder,
  query,
  selectedValue,
  options,
  emptyMessage,
  helperText,
  onOpen,
  onQueryChange,
  onSelect,
  renderOption
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const inputId = useId();
  const listboxId = useId();
  const safeOptions = useMemo(() => options || [], [options]);
  const hasOptions = safeOptions.length > 0;
  const lastOptionIndex = Math.max(0, safeOptions.length - 1);

  useEffect(() => {
    setHighlightedIndex((current) => Math.min(current, lastOptionIndex));
  }, [lastOptionIndex]);

  function openMenu() {
    onOpen?.();
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  function selectOption(option) {
    onSelect(option);
    closeMenu();
    inputRef.current?.focus();
  }

  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-400" id={`${inputId}-label`}>
        {label}
      </span>
      <div
        ref={wrapperRef}
        className="relative"
        onBlur={(event) => {
          if (wrapperRef.current?.contains(event.relatedTarget)) {
            return;
          }

          setIsOpen(false);
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            value={query}
            placeholder={placeholder}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-labelledby={`${inputId}-label`}
            aria-activedescendant={
              isOpen && safeOptions[highlightedIndex] ? `${listboxId}-${safeOptions[highlightedIndex].key}` : undefined
            }
            onFocus={() => {
              openMenu();
              setHighlightedIndex(0);
            }}
            onChange={(event) => {
              openMenu();
              onQueryChange(event.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                openMenu();
                setHighlightedIndex((current) => (isOpen ? Math.min(current + 1, lastOptionIndex) : 0));
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                openMenu();
                setHighlightedIndex((current) => (isOpen ? Math.max(current - 1, 0) : lastOptionIndex));
              }

              if ((event.key === "Enter" || event.key === "Tab") && isOpen && safeOptions[highlightedIndex]) {
                event.preventDefault();
                selectOption(safeOptions[highlightedIndex]);
              }

              if (event.key === "Escape") {
                closeMenu();
              }

              if (event.key === "Tab" && !hasOptions) {
                closeMenu();
              }
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-14 text-sm text-white outline-none transition focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/20"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!isOpen) {
                openMenu();
                setHighlightedIndex(0);
              } else {
                closeMenu();
              }
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 flex min-w-12 items-center justify-center text-slate-400 transition hover:text-white"
            aria-label={`${label} seceneklerini ac`}
            aria-expanded={isOpen}
            aria-controls={listboxId}
          >
            Sec
          </button>
        </div>

        {selectedValue ? <p className="mt-2 text-xs text-slate-500">Secili: {selectedValue}</p> : null}
        {helperText ? <p className="mt-2 text-xs text-slate-500">{helperText}</p> : null}

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 z-[1400] mt-3 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
            >
              <div id={listboxId} role="listbox" className="max-h-72 overflow-y-auto p-2">
                {safeOptions.length === 0 ? (
                  <div className="rounded-2xl px-3 py-4 text-sm text-slate-400">{emptyMessage}</div>
                ) : (
                  safeOptions.map((option, index) => (
                    <button
                      key={option.key}
                      id={`${listboxId}-${option.key}`}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        selectOption(option);
                      }}
                      className={`flex min-h-12 w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-white transition hover:bg-white/10 ${
                        highlightedIndex === index ? "bg-white/10" : ""
                      }`}
                    >
                      {renderOption(option)}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </label>
  );
}
