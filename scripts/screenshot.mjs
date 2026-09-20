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
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle0" });
await page.waitForFunction(() => document.querySelector("canvas"));
await new Promise((r) => setTimeout(r, 3200));
await page.screenshot({ path: path.join(outDir, "title_harbour_of_dusk.png"), type: "png" });

await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => /enter the harbour/i.test(b.textContent || ""));
  btn?.click();
});
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: path.join(outDir, "ingame_hud_harbour.png"), type: "png" });

await page.keyboard.press("KeyE");
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: path.join(outDir, "npc_dialog_corin.png"), type: "png" });

async function clickLabel(re) {
  return page.evaluate((source) => {
    const rx = new RegExp(source, "i");
    const btn = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || ""));
    btn?.click();
    return btn?.textContent ?? null;
  }, re);
}

const continued = await clickLabel("continue");
await new Promise((r) => setTimeout(r, 500));
const accepted = await clickLabel("accept");
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: path.join(outDir, "quest_accepted.png"), type: "png" });

await page.keyboard.press("KeyC");
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: path.join(outDir, "skills_panel.png"), type: "png" });
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 200));
await page.keyboard.press("KeyI");
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: path.join(outDir, "inventory_panel.png"), type: "png" });
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 250));

await page.keyboard.down("KeyA");
await new Promise((r) => setTimeout(r, 1100));
await page.keyboard.up("KeyA");
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: path.join(outDir, "walking_to_moonpetals.png"), type: "png" });
await page.keyboard.down("KeyE");
await new Promise((r) => setTimeout(r, 1800));
await page.keyboard.up("KeyE");
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: path.join(outDir, "foraging_moonpetal.png"), type: "png" });

await browser.close();
console.log({ continued, accepted, errors });
