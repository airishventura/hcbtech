let strings: Record<string, string> | null = null;
let pending: Promise<void> | null = null;
export function loadEnglish() {
  return pending ??= import("./english").then(module => { strings = module.default; });
}
export function englishText(text: string) { return strings?.[text] ?? text; }
export function englishReady() { return strings !== null; }
