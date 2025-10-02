import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HelpModal } from "../components/HelpModal";

describe("HelpModal", () => {
  it("renders modal content when open", () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/About Lilt GUI/i)).toBeInTheDocument();
    expect(screen.getByText(/What is Lilt/i)).toBeInTheDocument();
    expect(screen.getByText(/Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Author/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<HelpModal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByText(/About Lilt GUI/i)).not.toBeInTheDocument();
  });

  it("displays feature list", () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Convert FLAC, ALAC and MP3 files/i)).toBeInTheDocument();
    expect(screen.getByText(/Support for multiple output formats/i)).toBeInTheDocument();
    expect(screen.getByText(/Preserve metadata and cover art/i)).toBeInTheDocument();
  });

  it("displays author information", () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Created by Arda Kilicdagi/i)).toBeInTheDocument();
  });

  it("has close button", () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Close/i)).toBeInTheDocument();
  });

  it("has visit github button", () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Visit GitHub Repository/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);

    const overlay = screen.getByText(/About Lilt GUI/i).closest(".modal-overlay");
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("does not close when clicking modal content", () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);

    const modal = screen.getByText(/About Lilt GUI/i).closest(".modal");
    if (modal) {
      fireEvent.click(modal);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it("opens github link when visit button is clicked", async () => {
    const { open } = await import("@tauri-apps/plugin-shell");
    const mockOpen = vi.mocked(open);

    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    const githubButton = screen.getByText(/Visit GitHub Repository/i);
    fireEvent.click(githubButton);

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledWith("https://github.com/Ardakilic/");
    });
  });
});
