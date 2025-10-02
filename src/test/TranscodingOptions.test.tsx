import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TranscodingOptions } from "../components/TranscodingOptions";
import type { Settings } from "../types";

const mockSettings: Settings = {
  liltPath: "/usr/bin/lilt",
  soxPath: "/usr/bin/sox",
  ffmpegPath: "/usr/bin/ffmpeg",
  ffprobePath: "/usr/bin/ffprobe",
  useDocker: true,
  enforceOutputFormat: "default",
  noPreserveMetadata: false,
  copyImages: true,
  sourceDir: "/path/to/source",
  targetDir: "/path/to/target",
};

describe("TranscodingOptions", () => {
  it("renders transcoding options section", () => {
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={vi.fn()} />);

    expect(screen.getByText(/Transcoding Options/i)).toBeInTheDocument();
  });

  it("renders all option checkboxes", () => {
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={vi.fn()} />);

    expect(screen.getByText(/Use Docker/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't Preserve Metadata/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy Images/i)).toBeInTheDocument();
  });

  it("renders format selector", () => {
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={vi.fn()} />);

    expect(screen.getByText(/Enforce Output Format/i)).toBeInTheDocument();
  });

  it("toggles useDocker checkbox", () => {
    const onSettingsChange = vi.fn();
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const dockerCheckbox = screen.getByRole("checkbox", { name: /Use Docker/i });
    fireEvent.click(dockerCheckbox);

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      useDocker: false,
    });
  });

  it("toggles noPreserveMetadata checkbox", () => {
    const onSettingsChange = vi.fn();
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const metadataCheckbox = screen.getByRole("checkbox", { name: /Don't Preserve Metadata/i });
    fireEvent.click(metadataCheckbox);

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      noPreserveMetadata: true,
    });
  });

  it("toggles copyImages checkbox", () => {
    const onSettingsChange = vi.fn();
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const copyImagesCheckbox = screen.getByRole("checkbox", { name: /Copy Images/i });
    fireEvent.click(copyImagesCheckbox);

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      copyImages: false,
    });
  });

  it("changes output format to FLAC", () => {
    const onSettingsChange = vi.fn();
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const formatSelect = screen.getByDisplayValue(/Default/i);
    fireEvent.change(formatSelect, { target: { value: "flac" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      enforceOutputFormat: "flac",
    });
  });

  it("changes output format to MP3", () => {
    const onSettingsChange = vi.fn();
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const formatSelect = screen.getByDisplayValue(/Default/i);
    fireEvent.change(formatSelect, { target: { value: "mp3" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      enforceOutputFormat: "mp3",
    });
  });

  it("changes output format to ALAC", () => {
    const onSettingsChange = vi.fn();
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const formatSelect = screen.getByDisplayValue(/Default/i);
    fireEvent.change(formatSelect, { target: { value: "alac" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      enforceOutputFormat: "alac",
    });
  });

  it("shows correct checkbox states", () => {
    render(<TranscodingOptions settings={mockSettings} onSettingsChange={vi.fn()} />);

    const dockerCheckbox = screen.getByRole("checkbox", { name: /Use Docker/i });
    const metadataCheckbox = screen.getByRole("checkbox", { name: /Don't Preserve Metadata/i });
    const copyImagesCheckbox = screen.getByRole("checkbox", { name: /Copy Images/i });

    expect(dockerCheckbox).toBeChecked();
    expect(metadataCheckbox).not.toBeChecked();
    expect(copyImagesCheckbox).toBeChecked();
  });
});
