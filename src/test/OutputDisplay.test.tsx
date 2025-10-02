import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OutputDisplay } from "../components/OutputDisplay";

describe("OutputDisplay", () => {
  it("renders output section", () => {
    render(<OutputDisplay output={[]} isRunning={false} onClear={vi.fn()} />);

    expect(screen.getByText(/Output/i)).toBeInTheDocument();
  });

  it("displays output lines", () => {
    const output = ["Line 1", "Line 2", "Line 3"];
    render(<OutputDisplay output={output} isRunning={false} onClear={vi.fn()} />);

    // All lines are in a single <pre> tag, check using textContent
    const pre = document.querySelector("pre");
    expect(pre?.textContent).toContain("Line 1");
    expect(pre?.textContent).toContain("Line 2");
    expect(pre?.textContent).toContain("Line 3");
  });

  it("displays waiting message when output is empty", () => {
    render(<OutputDisplay output={[]} isRunning={false} onClear={vi.fn()} />);

    expect(screen.getByText(/Waiting to start/i)).toBeInTheDocument();
  });

  it("shows clear button", () => {
    render(<OutputDisplay output={["Line 1"]} isRunning={false} onClear={vi.fn()} />);

    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", () => {
    const onClear = vi.fn();
    render(<OutputDisplay output={["Line 1"]} isRunning={false} onClear={onClear} />);

    const clearButton = screen.getByText(/Clear/i);
    fireEvent.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });

  it("displays multiple output lines", () => {
    const output = [
      "[10:00:00] Starting transcoding",
      "[10:00:01] Processing file 1",
      "[10:00:02] Processing file 2",
      "[10:00:03] Complete",
    ];
    render(<OutputDisplay output={output} isRunning={false} onClear={vi.fn()} />);

    // Check that the output container has the text (it's all in a single <pre> tag)
    const outputContainer = screen.getByText(/Starting transcoding/i);
    expect(outputContainer).toBeInTheDocument();
    expect(outputContainer.textContent).toContain("Processing file 1");
    expect(outputContainer.textContent).toContain("Complete");
  });

  it("shows running status message", () => {
    render(
      <OutputDisplay
        output={["Starting..."]}
        isRunning={true}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByText("Starting...")).toBeInTheDocument();
  });
});
