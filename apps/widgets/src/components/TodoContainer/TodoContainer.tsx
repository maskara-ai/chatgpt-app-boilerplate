import type { Todo } from "@/types/todo";
import { Checkbox } from "@openai/apps-sdk-ui/components/Checkbox";

type TodoContainerProps = {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  isLoading: boolean;
};

export default function TodoContainer({
  todos,
  onToggleComplete,
  isLoading,
}: TodoContainerProps) {
  return (
    <div className="w-full bg-surface border border-default rounded-2xl shadow-sm p-4 flex flex-col gap-4 text-primary relative">
      {isLoading && (
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-primary/70">Loading...</p>
          </div>
        </div>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Checkbox
              onCheckedChange={() => onToggleComplete(todo.id)}
              label={todo.title}
              checked={todo.completed}
            />
          </li>
        ))}
      </ul>
      {todos.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No todos yet
        </p>
      )}
    </div>
  );
}
