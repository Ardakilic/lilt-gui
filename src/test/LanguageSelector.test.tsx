import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageSelector } from "../components/LanguageSelector";

describe("LanguageSelector", () => {
  it("renders language selector button", () => {
    render(<LanguageSelector />);

    expect(screen.getByText("🌐")).toBeInTheDocument();
    expect(screen.getByText(/English/i)).toBeInTheDocument();
  });

  it("opens dropdown when button is clicked", () => {
    render(<LanguageSelector />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Türkçe")).toBeInTheDocument();
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("closes dropdown when clicking again", () => {
    render(<LanguageSelector />);

    const button = screen.getByRole("button");

    // Open dropdown
    fireEvent.click(button);
    expect(screen.getByText("Türkçe")).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(button);
    expect(screen.queryByText("Türkçe")).not.toBeInTheDocument();
  });

  it("changes language when option is clicked", () => {
    render(<LanguageSelector />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const turkishOption = screen.getByText("Türkçe");
    fireEvent.click(turkishOption);

    // Button should now show Turkish
    expect(screen.getByText("Türkçe")).toBeInTheDocument();
  });

  it("changes language to German", () => {
    render(<LanguageSelector />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const germanOption = screen.getByText("Deutsch");
    fireEvent.click(germanOption);

    expect(screen.getByText("Deutsch")).toBeInTheDocument();
  });

  it("changes language to Spanish", () => {
    render(<LanguageSelector />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const spanishOption = screen.getByText("Español");
    fireEvent.click(spanishOption);

    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("closes dropdown after selecting language", () => {
    render(<LanguageSelector />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const turkishOption = screen.getByText("Türkçe");
    fireEvent.click(turkishOption);

    // Dropdown should be closed (German option should not be visible)
    expect(screen.queryByText("Deutsch")).not.toBeInTheDocument();
  });
});
