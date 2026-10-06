import Image from "next/image";
import { HERO, HERO_SIZES } from "../constants";

/**
 * AFTER: next/image.
 * - width/height reserve space (no layout shift) and keep the 3:2 ratio
 * - sizes lets the browser pick a small candidate from the generated srcset
 * - preload marks it as the LCP image and adds <link rel="preload"> in <head>
 */
export function AfterHero() {
  return (
    <Image
      src={HERO.src}
      alt={HERO.alt}
      width={HERO.width}
      height={HERO.height}
      sizes={HERO_SIZES}
      preload
      className="h-auto w-full rounded-xl"
    />
  );
}
