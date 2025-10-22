import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { SearchHistoryDropdown } from "./SearchHistoryDropdown";
import { useSearchStore } from "@/store/search-store";

describe("SearchHistoryDropdown", () => {
  const mockOnSelectQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useSearchStore.getState().clearHistory();
  });

  it("should not render when isVisible is false", () => {
    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={false}
      />
    );

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should not render when search history is empty", () => {
    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should render search history when visible and history exists", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");
    addToHistory("javascript basics");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(
      screen.getByRole("listbox", { name: /search history/i })
    ).toBeInTheDocument();
  });

  it("should display all search history items", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");
    addToHistory("javascript basics");
    addToHistory("typescript guide");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.getByText("react tutorial")).toBeInTheDocument();
    expect(screen.getByText("javascript basics")).toBeInTheDocument();
    expect(screen.getByText("typescript guide")).toBeInTheDocument();
  });

  it("should call onSelectQuery when history item is clicked", async () => {
    const user = userEvent.setup();
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    const historyItem = screen.getByText("react tutorial");
    await user.click(historyItem);

    expect(mockOnSelectQuery).toHaveBeenCalledWith("react tutorial");
    expect(mockOnSelectQuery).toHaveBeenCalledTimes(1);
  });

  it("should display clear all button", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    const clearButton = screen.getByRole("button", { name: /clear all/i });
    expect(clearButton).toBeInTheDocument();
  });

  it("should clear all history when clear all button is clicked", async () => {
    const user = userEvent.setup();
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");
    addToHistory("javascript basics");

    const { rerender } = render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.getByText("react tutorial")).toBeInTheDocument();
    expect(screen.getByText("javascript basics")).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: /clear all/i });
    await user.click(clearButton);

    rerender(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should display remove button for each history item", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    const removeButton = screen.getByRole("button", {
      name: /remove react tutorial from history/i,
    });
    expect(removeButton).toBeInTheDocument();
  });

  it("should remove individual history item when remove button is clicked", async () => {
    const user = userEvent.setup();
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");
    addToHistory("javascript basics");

    const { rerender } = render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.getByText("react tutorial")).toBeInTheDocument();
    expect(screen.getByText("javascript basics")).toBeInTheDocument();

    const removeButton = screen.getByRole("button", {
      name: /remove react tutorial from history/i,
    });
    await user.click(removeButton);

    rerender(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.queryByText("react tutorial")).not.toBeInTheDocument();
    expect(screen.getByText("javascript basics")).toBeInTheDocument();
  });

  it("should not call onSelectQuery when remove button is clicked", async () => {
    const user = userEvent.setup();
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    const removeButton = screen.getByRole("button", {
      name: /remove react tutorial from history/i,
    });
    await user.click(removeButton);

    expect(mockOnSelectQuery).not.toHaveBeenCalled();
  });

  it("should have proper accessibility attributes", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-label", "Search history");
  });

  it("should display clock icon for each history item", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    const { container } = render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    const clockIcons = container.querySelectorAll('[aria-hidden="true"]');
    expect(clockIcons.length).toBeGreaterThan(0);
  });

  it("should display search history title", () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory("react tutorial");

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    expect(screen.getByText("Search History")).toBeInTheDocument();
  });

  it("should handle multiple history items correctly", () => {
    const { addToHistory } = useSearchStore.getState();
    const queries = [
      "react tutorial",
      "javascript basics",
      "typescript guide",
      "node.js tutorial",
      "next.js guide",
    ];

    queries.forEach((query) => addToHistory(query));

    render(
      <SearchHistoryDropdown
        onSelectQuery={mockOnSelectQuery}
        isVisible={true}
      />
    );

    queries.forEach((query) => {
      expect(screen.getByText(query)).toBeInTheDocument();
    });
  });
});
