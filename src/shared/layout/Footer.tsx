export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500">
      Photos from{" "}
      <a className="underline" href="https://picsum.photos" target="_blank" rel="noreferrer">
        Lorem Picsum
      </a>
      . Built with Next.js, Tailwind CSS and TanStack Query.
    </footer>
  );
}
