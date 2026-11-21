import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("tampilan exploded dapat diekspor sebagai PNG yang valid", async ({ page }) => {
  await page.goto("/mesin/piringan-gearbox-meja-listrik");
  await page.getByRole("tab", { name: "Lihat 3D" }).click();
  await page.getByRole("button", { name: "Pisahkan komponen" }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh tampilan 3D sebagai PNG" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/hcbtech-.*-pisah\.png$/);
  const path = await download.path();
  expect(path).not.toBeNull();
  const bytes = await readFile(path!);
  expect(Array.from(bytes.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  await expect(page.getByText(/PNG berhasil dibuat/)).toBeVisible();
});
