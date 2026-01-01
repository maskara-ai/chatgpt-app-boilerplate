import { useCallback, useEffect, useState } from "react";
import { useOpenAiGlobal } from "@/hooks/use-openai-global";
import { useWidgetState } from "@/hooks/use-widget-state";
import type { Todo, ToDoContent, ToDoWidgetState } from "@/types/todo";
import { TodoContainer } from "@/components/TodoContainer";

function App() {
  const toolOutput = (useOpenAiGlobal("toolOutput") ??
    null) as ToDoContent | null;

  const [todoTasks, setTodoTasks] = useState<Todo[]>([]);

  const [widgetState, setWidgetState] = useWidgetState<ToDoWidgetState>({
    status: "idle",
  });

  useEffect(() => {
    if (toolOutput && toolOutput.tasks) {
      setTodoTasks(toolOutput.tasks);
    }
  }, [toolOutput]);

  const handleCompleteTodo = useCallback(async (id: string) => {
    if (!window.openai?.callTool) {
      console.error("callTool unavailable");
      return;
    }

    try {
      setWidgetState({ status: "loading" });
      const response = await window.openai.callTool("complete_todo", {
        id,
      });
      setTodoTasks((response as { result: string, structuredContent: { tasks: Todo[] } }).structuredContent.tasks);
      setWidgetState({ status: "idle" });
    } catch (error) {
      console.error("callTool(\"complete_todo\") failed", error);
      setWidgetState({ status: "error" });
    }
  }, []);

  return (
    <div className="w-full">
      <TodoContainer
        todos={todoTasks}
        onToggleComplete={handleCompleteTodo}
        isLoading={widgetState?.status === "loading"}
      />
    </div>
  );
}

export default App;
