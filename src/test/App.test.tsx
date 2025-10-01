import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the app title", () => {
    render(<App />);
    expect(screen.getByText(/Lilt GUI/i)).toBeInTheDocument();
  });

  it("renders main sections", () => {
    render(<App />);
    expect(screen.getByText(/Binary Configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/Transcoding Options/i)).toBeInTheDocument();
    expect(screen.getByText(/Folders/i)).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /Start Transcoding/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Stop Transcoding/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download Lilt/i })).toBeInTheDocument();
  });
});
