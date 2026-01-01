import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoContainer from "./TodoContainer";
import type { Todo } from "@/types/todo";

describe("TodoContainer", () => {
  const mockOnToggleComplete = vi.fn();

  const mockTodos: Todo[] = [
    { id: "1", title: "First todo", completed: false },
    { id: "2", title: "Second todo", completed: true },
    { id: "3", title: "Third todo", completed: false },
  ];

  beforeEach(() => {
    mockOnToggleComplete.mockClear();
  });

  test("renders all todos", () => {
    render(
      <TodoContainer
        todos={mockTodos}
        onToggleComplete={mockOnToggleComplete}
        isLoading={false}
      />
    );

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.getByText("Second todo")).toBeInTheDocument();
    expect(screen.getByText("Third todo")).toBeInTheDocument();
  });

  test("renders checkboxes with correct checked state", () => {
    render(
      <TodoContainer
        todos={mockTodos}
        onToggleComplete={mockOnToggleComplete}
        isLoading={false}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  test("calls onToggleComplete when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TodoContainer
        todos={mockTodos}
        onToggleComplete={mockOnToggleComplete}
        isLoading={false}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith("1");
  });

  test("displays 'No todos yet' when todos array is empty", () => {
    render(
      <TodoContainer todos={[]} onToggleComplete={mockOnToggleComplete} isLoading={false} />
    );

    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  test("does not display 'No todos yet' when todos exist", () => {
    render(
      <TodoContainer
        todos={mockTodos}
        onToggleComplete={mockOnToggleComplete}
        isLoading={false}
      />
    );

    expect(screen.queryByText("No todos yet")).not.toBeInTheDocument();
  });

  test("calls onToggleComplete with correct id for each todo", async () => {
    const user = userEvent.setup();
    render(
      <TodoContainer
        todos={mockTodos}
        onToggleComplete={mockOnToggleComplete}
        isLoading={false}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);
    expect(mockOnToggleComplete).toHaveBeenCalledWith("1");

    await user.click(checkboxes[1]);
    expect(mockOnToggleComplete).toHaveBeenCalledWith("2");

    await user.click(checkboxes[2]);
    expect(mockOnToggleComplete).toHaveBeenCalledWith("3");

    expect(mockOnToggleComplete).toHaveBeenCalledTimes(3);
  });
});
