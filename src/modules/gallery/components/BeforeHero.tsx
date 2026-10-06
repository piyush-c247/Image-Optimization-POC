import { HERO } from "../constants";

/**
 * BEFORE: bare <img>. Full 5000x3333 file, no width/height (layout shift),
 * no loading or fetchPriority attributes (default behaviour).
 */
export function BeforeHero() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={HERO.src} alt={HERO.alt} className="w-full rounded-xl" />
  );
}
