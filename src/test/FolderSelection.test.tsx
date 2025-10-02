import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FolderSelection } from "../components/FolderSelection";
import type { Settings } from "../types";

const mockSettings: Settings = {
  liltPath: "/usr/bin/lilt",
  soxPath: "/usr/bin/sox",
  ffmpegPath: "/usr/bin/ffmpeg",
  ffprobePath: "/usr/bin/ffprobe",
  useDocker: false,
  enforceOutputFormat: "default",
  noPreserveMetadata: false,
  copyImages: true,
  sourceDir: "/path/to/source",
  targetDir: "/path/to/target",
};

describe("FolderSelection", () => {
  it("renders folder selection fields", () => {
    render(<FolderSelection settings={mockSettings} onSettingsChange={vi.fn()} />);

    expect(screen.getByText(/Source Folder/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Folder/i)).toBeInTheDocument();
  });

  it("displays current folder paths", () => {
    render(<FolderSelection settings={mockSettings} onSettingsChange={vi.fn()} />);

    expect(screen.getByDisplayValue("/path/to/source")).toBeInTheDocument();
    expect(screen.getByDisplayValue("/path/to/target")).toBeInTheDocument();
  });

  it("updates source folder when input changes", () => {
    const onSettingsChange = vi.fn();
    render(<FolderSelection settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const sourceInput = screen.getByDisplayValue("/path/to/source");
    fireEvent.change(sourceInput, { target: { value: "/new/source" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      sourceDir: "/new/source",
    });
  });

  it("updates target folder when input changes", () => {
    const onSettingsChange = vi.fn();
    render(<FolderSelection settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const targetInput = screen.getByDisplayValue("/path/to/target");
    fireEvent.change(targetInput, { target: { value: "/new/target" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      targetDir: "/new/target",
    });
  });

  it("shows browse buttons for both folders", () => {
    render(<FolderSelection settings={mockSettings} onSettingsChange={vi.fn()} />);

    const browseButtons = screen.getAllByText(/Browse/i);
    expect(browseButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("shows alert when clicking browse in browser mode", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FolderSelection settings={mockSettings} onSettingsChange={vi.fn()} />);

    const browseButtons = screen.getAllByText(/Browse/i);
    if (browseButtons[0]) {
      fireEvent.click(browseButtons[0]);
    }

    expect(alertMock).toHaveBeenCalledWith(
      "File dialogs only work in the Tauri app. Use 'make dev-tauri' to test this feature.",
    );

    alertMock.mockRestore();
  });

  it("clears folder paths", () => {
    const onSettingsChange = vi.fn();
    render(<FolderSelection settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const sourceInput = screen.getByDisplayValue("/path/to/source");
    fireEvent.change(sourceInput, { target: { value: "" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      sourceDir: "",
    });
  });
});
