import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const dest = path.join(root, "release", "windows", "game");

const build = spawnSync("npx", ["vite", "build"], { cwd: root, stdio: "inherit", shell: true });
if (build.status !== 0) process.exit(build.status ?? 1);

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
mkdirSync(path.dirname(dest), { recursive: true });
cpSync(dist, dest, { recursive: true });
console.log("Packaged Windows harbour →", dest);
console.log("Overwrite on Peter's PC: C:\\Users\\Robbi\\Desktop\\Aetherion Outside\\  (same folder every time)");
console.log("Launcher: Play Aetherion Outside.vbs");
