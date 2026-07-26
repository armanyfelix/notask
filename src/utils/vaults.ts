import { basename } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store";

export const VAULTS_STORE = "vaults.json";
export const DEFAULTS_STORE = "defaults.json";
export const DEFAULT_VAULT_KEY = "vault";

export async function registerVault(name: string, path: string) {
  const vaultsStore = await load(VAULTS_STORE);
  await vaultsStore.set(name, path);

  const defaultsStore = await load(DEFAULTS_STORE);
  await defaultsStore.set(DEFAULT_VAULT_KEY, name);
}

export async function registerExistingVault(path: string) {
  const name = (await basename(path)) || "Vault";
  await registerVault(name, path);
  return name;
}

export async function migrateHubsToVaults() {
  const vaultsStore = await load(VAULTS_STORE);
  if ((await vaultsStore.length()) > 0) return vaultsStore;

  const hubsStore = await load("hubs.json");
  const hubKeys = await hubsStore.keys();
  if (hubKeys.length === 0) return vaultsStore;

  for (const key of hubKeys) {
    const path = await hubsStore.get<string>(key);
    if (path) await vaultsStore.set(key, path);
  }

  const defaultsStore = await load(DEFAULTS_STORE);
  const oldDefault = await defaultsStore.get<string>("hub");
  if (oldDefault) await defaultsStore.set(DEFAULT_VAULT_KEY, oldDefault);

  return vaultsStore;
}
