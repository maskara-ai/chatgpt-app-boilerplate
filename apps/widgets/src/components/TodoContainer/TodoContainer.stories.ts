import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import TodoContainer from "./TodoContainer";
import type { Todo } from "../../types/todo";

const meta = {
  title: "Components/TodoContainer",
  component: TodoContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onToggleComplete: fn(),
  },
} satisfies Meta<typeof TodoContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTodos: Todo[] = [
  { id: "1", title: "Complete project documentation", completed: false },
  { id: "2", title: "Review pull requests", completed: true },
  { id: "3", title: "Update dependencies", completed: false },
];

export const Default: Story = {
  args: {
    todos: sampleTodos,
  },
};

export const Empty: Story = {
  args: {
    todos: [],
  },
};

export const AllCompleted: Story = {
  args: {
    todos: [
      { id: "1", title: "Task 1", completed: true },
      { id: "2", title: "Task 2", completed: true },
      { id: "3", title: "Task 3", completed: true },
    ],
  },
};

export const AllUncompleted: Story = {
  args: {
    todos: [
      { id: "1", title: "Task 1", completed: false },
      { id: "2", title: "Task 2", completed: false },
      { id: "3", title: "Task 3", completed: false },
    ],
  },
};

export const SingleTodo: Story = {
  args: {
    todos: [{ id: "1", title: "Single todo item", completed: false }],
  },
};
