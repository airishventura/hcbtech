import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "../src/data/products";

const root = process.cwd();
const manifest = JSON.parse(readFileSync(resolve(root, "assets/manifest.json"), "utf8"));

describe("supplied asset integrity", () => {
  it("preserves every unique original and its source provenance", () => {
    expect(manifest.assets).toHaveLength(manifest.uniqueFileCount);
    const hashes = manifest.assets.map((asset: { path: string; sha256: string; sourceFiles: string[] }) => {
      expect(asset.sourceFiles.length).toBeGreaterThan(0);
      const hash = createHash("sha256").update(readFileSync(resolve(root, asset.path))).digest("hex");
      expect(hash).toBe(asset.sha256);
      return hash;
    });
    expect(new Set(hashes).size).toBe(hashes.length);
    expect(manifest.assets.reduce((sum: number, asset: { sourceFiles: string[] }) => sum + asset.sourceFiles.length, 0)).toBe(manifest.sourceFileCount);
  });
  it("resolves every product poster and gallery asset", () => {
    for (const product of products) {
      for (const src of [product.posterImage, ...product.gallery.map((item) => item.src)]) {
        expect(existsSync(resolve(root, `public${src}`)), src).toBe(true);
      }
    }
  });
});
