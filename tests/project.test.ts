import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const tauriConfig = JSON.parse(
  readFileSync(join(root, "src-tauri/tauri.conf.json"), "utf8"),
);

describe("project configuration", () => {
  test("keeps frontend and Tauri versions aligned", () => {
    expect(tauriConfig.version).toBe(packageJson.version);
  });

  test("uses reproducible Bun commands in Tauri", () => {
    expect(tauriConfig.build.beforeDevCommand).toBe("bun run dev");
    expect(tauriConfig.build.beforeBuildCommand).toBe("bun run build");
  });

  test("enables a content security policy", () => {
    expect(tauriConfig.app.security.csp).toBeString();
    expect(tauriConfig.app.security.csp.length).toBeGreaterThan(0);
  });

  test("ships both Inter variable font styles", () => {
    expect(
      existsSync(join(root, "public/fonts/inter/InterVariable.woff2")),
    ).toBeTrue();
    expect(
      existsSync(join(root, "public/fonts/inter/InterVariable-Italic.woff2")),
    ).toBeTrue();
  });
});
