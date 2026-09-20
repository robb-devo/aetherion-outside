import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const chrome = process.env.CHROME || "/usr/local/bin/google-chrome";
const url = process.env.URL || "http://127.0.0.1:5173/";
const outDir = path.resolve("docs/screenshots");
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--window-size=1600,900",
  ],
  defaultViewport: { width: 1600, height: 900 },
});

const page = await browser.newPage();
page.setDefaultTimeout(60000);
await page.goto(url, { waitUntil: "networkidle0" });
await page.waitForFunction(() => document.querySelector("canvas"));
await new Promise((r) => setTimeout(r, 4000));
await page.screenshot({ path: path.join(outDir, "title_harbour_of_dusk.png"), type: "png" });

const entered = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => /enter the harbour/i.test(b.textContent || ""));
  if (btn) {
    btn.click();
    return true;
  }
  return false;
});
if (entered) {
  await new Promise((r) => setTimeout(r, 2500));
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, "ingame_hud_harbour.png"), type: "png" });
  await page.keyboard.press("KeyC");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, "skills_panel.png"), type: "png" });
  await page.keyboard.press("Escape");
  await page.keyboard.press("KeyI");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, "inventory_panel.png"), type: "png" });
}

await browser.close();
console.log("wrote screenshots to", outDir);
