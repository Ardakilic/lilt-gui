import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Actions } from "../components/Actions";
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

describe("Actions", () => {
  it("renders all action buttons", () => {
    render(
      <Actions
        settings={mockSettings}
        isRunning={false}
        onTranscodingStart={vi.fn()}
        onTranscodingStop={vi.fn()}
      />,
    );

    expect(screen.getByText(/Start Transcoding/i)).toBeInTheDocument();
    expect(screen.getByText(/Stop Transcoding/i)).toBeInTheDocument();
    expect(screen.getByText(/Download Lilt/i)).toBeInTheDocument();
  });

  it("validates lilt path before starting", () => {
    const onStart = vi.fn();
    const settingsWithoutLilt = { ...mockSettings, liltPath: "" };

    render(
      <Actions
        settings={settingsWithoutLilt}
        isRunning={false}
        onTranscodingStart={onStart}
        onTranscodingStop={vi.fn()}
      />,
    );

    const startButton = screen.getByText(/Start Transcoding/i);
    fireEvent.click(startButton);

    expect(onStart).not.toHaveBeenCalled();
    expect(screen.getByText(/Lilt Binary/i)).toBeInTheDocument();
  });

  it("validates sox path when not using docker", () => {
    const onStart = vi.fn();
    const settingsWithoutSox = { ...mockSettings, soxPath: "" };

    render(
      <Actions
        settings={settingsWithoutSox}
        isRunning={false}
        onTranscodingStart={onStart}
        onTranscodingStop={vi.fn()}
      />,
    );

    const startButton = screen.getByText(/Start Transcoding/i);
    fireEvent.click(startButton);

    expect(onStart).not.toHaveBeenCalled();
  });

  it("validates source and target directories", () => {
    const onStart = vi.fn();
    const settingsWithoutDirs = { ...mockSettings, sourceDir: "", targetDir: "" };

    render(
      <Actions
        settings={settingsWithoutDirs}
        isRunning={false}
        onTranscodingStart={onStart}
        onTranscodingStop={vi.fn()}
      />,
    );

    const startButton = screen.getByText(/Start Transcoding/i);
    fireEvent.click(startButton);

    expect(onStart).not.toHaveBeenCalled();
  });

  it("starts transcoding when validation passes", async () => {
    const onStart = vi.fn();

    render(
      <Actions
        settings={mockSettings}
        isRunning={false}
        onTranscodingStart={onStart}
        onTranscodingStop={vi.fn()}
      />,
    );

    const startButton = screen.getByText(/Start Transcoding/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(onStart).toHaveBeenCalled();
    });
  });

  it("stops transcoding when stop button is clicked", async () => {
    const onStop = vi.fn();

    render(
      <Actions
        settings={mockSettings}
        isRunning={true}
        onTranscodingStart={vi.fn()}
        onTranscodingStop={onStop}
      />,
    );

    const stopButton = screen.getByText(/Stop Transcoding/i);
    fireEvent.click(stopButton);

    await waitFor(() => {
      expect(onStop).toHaveBeenCalled();
    });
  });

  it("disables start button when running", () => {
    render(
      <Actions
        settings={mockSettings}
        isRunning={true}
        onTranscodingStart={vi.fn()}
        onTranscodingStop={vi.fn()}
      />,
    );

    const startButton = screen.getByText(/Start Transcoding/i);
    expect(startButton).toBeDisabled();
  });

  it("disables stop button when not running", () => {
    render(
      <Actions
        settings={mockSettings}
        isRunning={false}
        onTranscodingStart={vi.fn()}
        onTranscodingStop={vi.fn()}
      />,
    );

    const stopButton = screen.getByText(/Stop Transcoding/i);
    expect(stopButton).toBeDisabled();
  });

  it("handles download button click", () => {
    // Mock window.open
    const mockOpen = vi.fn();
    vi.stubGlobal("open", mockOpen);

    render(
      <Actions
        settings={mockSettings}
        isRunning={false}
        onTranscodingStart={vi.fn()}
        onTranscodingStop={vi.fn()}
      />,
    );

    const downloadButton = screen.getByText(/Download Lilt/i);
    fireEvent.click(downloadButton);

    // In test environment, it should use window.open fallback
    expect(mockOpen).toHaveBeenCalledWith(
      "https://github.com/Ardakilic/lilt/releases/latest",
      "_blank",
    );

    vi.unstubAllGlobals();
  });

  it("skips sox/ffmpeg validation when using docker", async () => {
    const onStart = vi.fn();
    const dockerSettings = {
      ...mockSettings,
      useDocker: true,
      soxPath: "",
      ffmpegPath: "",
      ffprobePath: "",
    };

    render(
      <Actions
        settings={dockerSettings}
        isRunning={false}
        onTranscodingStart={onStart}
        onTranscodingStop={vi.fn()}
      />,
    );

    const startButton = screen.getByText(/Start Transcoding/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(onStart).toHaveBeenCalled();
    });
  });
});
