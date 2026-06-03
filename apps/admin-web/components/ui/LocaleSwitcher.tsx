// Sélecteur de langue — visuel uniquement pour l'instant (FR actif).
// La traduction anglaise sera branchée plus tard (next-intl) ; EN est désactivé.
export default function LocaleSwitcher() {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
      <span aria-current="true" className="text-ink">
        FR
      </span>
      <span aria-hidden className="text-ink-3/60">
        ·
      </span>
      <button
        type="button"
        disabled
        title="Traduction anglaise bientôt disponible"
        className="cursor-not-allowed text-ink-3/55 transition"
      >
        EN
      </button>
    </div>
  );
}
