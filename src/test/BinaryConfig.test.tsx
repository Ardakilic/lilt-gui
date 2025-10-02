import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BinaryConfig } from "../components/BinaryConfig";

describe("BinaryConfig", () => {
  const mockSettings = {
    liltPath: "/usr/bin/lilt",
    soxPath: "/usr/bin/sox",
    ffmpegPath: "/usr/bin/ffmpeg",
    ffprobePath: "/usr/bin/ffprobe",
    sourceDir: "",
    targetDir: "",
    useDocker: false,
    noPreserveMetadata: false,
    copyImages: false,
    targetFormat: "FLAC" as const,
    enforceOutputFormat: "default",
  };

  const mockOnChange = vi.fn();

  it("renders binary config inputs", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    expect(screen.getByPlaceholderText("/path/to/lilt")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("/path/to/sox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("/path/to/ffmpeg")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("/path/to/ffprobe")).toBeInTheDocument();
  });

  it("updates lilt path on input change", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    const input = screen.getByPlaceholderText("/path/to/lilt");
    fireEvent.change(input, { target: { value: "/new/path/lilt" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockSettings,
      liltPath: "/new/path/lilt",
    });
  });

  it("disables non-required fields when using docker", () => {
    const dockerSettings = { ...mockSettings, useDocker: true };

    render(<BinaryConfig settings={dockerSettings} onSettingsChange={mockOnChange} />);

    const soxInput = screen.getByPlaceholderText("/path/to/sox");
    const ffmpegInput = screen.getByPlaceholderText("/path/to/ffmpeg");
    const ffprobeInput = screen.getByPlaceholderText("/path/to/ffprobe");

    expect(soxInput).toBeDisabled();
    expect(ffmpegInput).toBeDisabled();
    expect(ffprobeInput).toBeDisabled();
  });

  it("shows alert in browser mode when browse button is clicked", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    const browseButtons = screen.getAllByText(/Browse/i);
    fireEvent.click(browseButtons[0]); // liltPath browse

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining("File dialogs only work in the Tauri app"),
    );

    alertSpy.mockRestore();
  });

  it("calls identify function for lilt binary", async () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    const identifyButtons = screen.getAllByText(/Identify/i);
    fireEvent.click(identifyButtons[0]); // lilt identify

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("calls identify function for sox binary", async () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    const identifyButtons = screen.getAllByText(/Identify/i);
    fireEvent.click(identifyButtons[1]); // sox identify

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("calls identify function for ffmpeg binary", async () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    const identifyButtons = screen.getAllByText(/Identify/i);
    fireEvent.click(identifyButtons[2]); // ffmpeg identify

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("calls identify function for ffprobe binary", async () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={mockOnChange} />);

    const identifyButtons = screen.getAllByText(/Identify/i);
    fireEvent.click(identifyButtons[3]); // ffprobe identify

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("renders all binary labels correctly", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={vi.fn()} />);

    expect(screen.getByText(/Lilt Binary/i)).toBeInTheDocument();
    expect(screen.getByText(/SoX or SoX_ng Binary/i)).toBeInTheDocument();
    expect(screen.getByText(/FFmpeg Binary/i)).toBeInTheDocument();
    expect(screen.getByText(/FFprobe Binary/i)).toBeInTheDocument();
  });

  it("displays current binary paths in inputs", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={vi.fn()} />);

    const liltInput = screen.getByDisplayValue("/usr/bin/lilt");
    const soxInput = screen.getByDisplayValue("/usr/bin/sox");
    const ffmpegInput = screen.getByDisplayValue("/usr/bin/ffmpeg");
    const ffprobeInput = screen.getByDisplayValue("/usr/bin/ffprobe");

    expect(liltInput).toBeInTheDocument();
    expect(soxInput).toBeInTheDocument();
    expect(ffmpegInput).toBeInTheDocument();
    expect(ffprobeInput).toBeInTheDocument();
  });

  it("enables all inputs when not using docker", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={vi.fn()} />);

    const liltInput = screen.getByPlaceholderText("/path/to/lilt");
    const soxInput = screen.getByPlaceholderText("/path/to/sox");
    const ffmpegInput = screen.getByPlaceholderText("/path/to/ffmpeg");
    const ffprobeInput = screen.getByPlaceholderText("/path/to/ffprobe");

    expect(liltInput).not.toBeDisabled();
    expect(soxInput).not.toBeDisabled();
    expect(ffmpegInput).not.toBeDisabled();
    expect(ffprobeInput).not.toBeDisabled();
  });

  it("shows browse buttons for all binary inputs", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={vi.fn()} />);

    const browseButtons = screen.getAllByText(/Browse/i);
    expect(browseButtons).toHaveLength(4);
  });

  it("shows identify buttons for all binary inputs", () => {
    render(<BinaryConfig settings={mockSettings} onSettingsChange={vi.fn()} />);

    const identifyButtons = screen.getAllByText(/Identify/i);
    expect(identifyButtons).toHaveLength(4);
  });

  it("disables sox/ffmpeg browse buttons when using docker", () => {
    const dockerSettings = { ...mockSettings, useDocker: true };
    render(<BinaryConfig settings={dockerSettings} onSettingsChange={vi.fn()} />);

    const browseButtons = screen.getAllByText(/Browse/i);

    // Lilt browse should be enabled
    expect(browseButtons[0]).not.toBeDisabled();

    // SoX, FFmpeg, FFprobe browse should be disabled
    expect(browseButtons[1]).toBeDisabled();
    expect(browseButtons[2]).toBeDisabled();
    expect(browseButtons[3]).toBeDisabled();
  });

  it("updates sox path on input change", () => {
    const onSettingsChange = vi.fn();
    render(<BinaryConfig settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const soxInput = screen.getByDisplayValue("/usr/bin/sox");
    fireEvent.change(soxInput, { target: { value: "/new/sox" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      soxPath: "/new/sox",
    });
  });

  it("updates ffmpeg path on input change", () => {
    const onSettingsChange = vi.fn();
    render(<BinaryConfig settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const ffmpegInput = screen.getByDisplayValue("/usr/bin/ffmpeg");
    fireEvent.change(ffmpegInput, { target: { value: "/new/ffmpeg" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      ffmpegPath: "/new/ffmpeg",
    });
  });

  it("updates ffprobe path on input change", () => {
    const onSettingsChange = vi.fn();
    render(<BinaryConfig settings={mockSettings} onSettingsChange={onSettingsChange} />);

    const ffprobeInput = screen.getByDisplayValue("/usr/bin/ffprobe");
    fireEvent.change(ffprobeInput, { target: { value: "/new/ffprobe" } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      ffprobePath: "/new/ffprobe",
    });
  });
});
