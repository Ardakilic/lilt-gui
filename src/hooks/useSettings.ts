import { useEffect, useState } from "react";
import type { Settings } from "../types";
import { defaultSettings } from "../types";

const SETTINGS_KEY = "lilt-gui-settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  return [settings, setSettings] as const;
}
