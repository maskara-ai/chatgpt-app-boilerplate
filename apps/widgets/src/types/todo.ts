export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type ToDoContent = {
  tasks: Todo[];
};

export type ToDoWidgetState = {
  status: "idle" | "loading" | "error";
};
