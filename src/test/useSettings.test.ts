import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSettings } from "../hooks/useSettings";

describe("useSettings", () => {
  it("returns default settings initially", () => {
    const { result } = renderHook(() => useSettings());
    const [settings] = result.current;

    expect(settings.useDocker).toBe(true);
    expect(settings.copyImages).toBe(true);
    expect(settings.noPreserveMetadata).toBe(false);
  });

  it("saves settings to localStorage", () => {
    const { result } = renderHook(() => useSettings());
    const [, setSettings] = result.current;

    const newSettings = {
      ...result.current[0],
      liltPath: "/usr/bin/lilt",
      useDocker: false,
    };

    setSettings(newSettings);

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
