import { useMemo } from "react";
import { useOpenAiGlobal } from "@/hooks/use-openai-global";
import { useWidgetState } from "@/hooks/use-widget-state";
import type { ToDoContent, ToDoWidgetState } from "@/types/todo";
import { TodoContainer } from "@/components/TodoContainer";

function App() {
  const toolOutput = (useOpenAiGlobal("toolOutput") ??
    null) as ToDoContent | null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [widgetState] = useWidgetState<ToDoWidgetState>({
    status: "idle",
  });

  const content = useMemo(
    () =>
      toolOutput ?? {
        tasks: [{ id: "1", title: "Buy groceries", completed: false }],
      },
    [toolOutput]
  );

  return (
    <div className="h-96 w-full">
      <TodoContainer todos={content.tasks} onToggleComplete={() => {}} />
    </div>
  );
}

export default App;
