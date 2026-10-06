"use client";

import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/before", label: "Before" },
  { href: "/after", label: "After" },
];

/**
 * Plain <a> tags are used on purpose: every switch between /before and /after
 * is a full page load, so each page is measured from a clean start.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-xs text-white">
            IMG
          </span>
          next/image POC
        </a>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white"
                    : "rounded-md px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
