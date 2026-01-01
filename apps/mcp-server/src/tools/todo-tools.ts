import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const completeTodoInputSchema = {
  id: z.string().min(1),
};

const addTodoInputSchema = {
  title: z.string().min(1),
};

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

let todos: Todo[] = [];
let nextId = 1;

const replyWithTodos = (message: string): CallToolResult => ({
  content: message ? [{ type: "text", text: message }] : [],
  structuredContent: { tasks: todos },
});

async function handleAddTodo(args: { title: string }): Promise<CallToolResult> {
  const title = args.title.trim();
  if (!title) return replyWithTodos("Missing title.");
  const todo = { id: `todo-${nextId++}`, title, completed: false };
  // Temporary workaround to avoid adding duplicate todos
  // https://github.com/openai/openai-apps-sdk-examples/issues/171
  if (todos.some((t) => t.title === title)) {
    return replyWithTodos(`Todo "${title}" already exists.`);
  }
  todos = [...todos, todo];
  return replyWithTodos(`Added "${todo.title}".`);
}

async function handleCompleteTodo(args: {
  id: string;
}): Promise<CallToolResult> {
  const id = args?.id;
  if (!id) return replyWithTodos("Missing todo id.");
  const todo = todos.find((task) => task.id === id);
  if (!todo) {
    return replyWithTodos(`Todo ${id} was not found.`);
  }

  todos = todos.map((task) =>
    task.id === id ? { ...task, completed: true } : task
  );

  return replyWithTodos(`Completed "${todo.title}".`);
}

function registerTools(server: McpServer) {
  logger.info("Registering todo tools...");

  server.registerTool(
    "add_todo",
    {
      title: "Add todo",
      description: "Creates a todo item with the given title.",
      inputSchema: addTodoInputSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/todo.html",
        "openai/toolInvocation/invoking": "Adding todo",
        "openai/toolInvocation/invoked": "Added todo",
      },
    },
    handleAddTodo
  );

  server.registerTool(
    "complete_todo",
    {
      title: "Complete todo",
      description: "Marks a todo as done by id.",
      inputSchema: completeTodoInputSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/todo.html",
        "openai/toolInvocation/invoking": "Completing todo",
        "openai/toolInvocation/invoked": "Completed todo",
      },
    },
    handleCompleteTodo
  );

  logger.info("Successfully registered todo tools.");
}

export default { registerTools };
