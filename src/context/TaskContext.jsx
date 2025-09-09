import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const TaskContext = createContext();

const initialState = {
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      const tasksWithExtra = action.payload.map((t) => ({
        ...t,
        important: t.important || false,
        description: t.description || "",
        createdAt: t.createdAt || new Date().toISOString(),
      }));
      return { ...state, tasks: tasksWithExtra, loading: false };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const fetchTasks = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      const tasksWithExtra = res.data.map((t) => ({
        ...t,
        important: false,
        description: "No description",
        createdAt: new Date().toISOString(),
      }));
      dispatch({ type: "FETCH_SUCCESS", payload: tasksWithExtra });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  };

  const addTask = (task) =>
    dispatch({
      type: "SET_TASKS",
      payload: [
        {
          ...task,
          important: task.important || false,
          description: task.description || "",
          createdAt: new Date().toISOString(),
        },
        ...state.tasks,
      ],
    });

  const toggleTask = (id) =>
    dispatch({
      type: "SET_TASKS",
      payload: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    });

  const deleteTask = (id) =>
    dispatch({
      type: "SET_TASKS",
      payload: state.tasks.filter((t) => t.id !== id),
    });

  const editTask = (id, title, description) =>
    dispatch({
      type: "SET_TASKS",
      payload: state.tasks.map((t) =>
        t.id === id ? { ...t, title, description } : t
      ),
    });

  const toggleImportant = (id) =>
    dispatch({
      type: "SET_TASKS",
      payload: state.tasks.map((t) =>
        t.id === id ? { ...t, important: !t.important } : t
      ),
    });

  const deleteAllTasks = () => dispatch({ type: "SET_TASKS", payload: [] });

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        fetchTasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        toggleImportant,
        deleteAllTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContext;
