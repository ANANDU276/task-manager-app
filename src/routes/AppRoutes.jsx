import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Tasks from "../pages/Tasks";
import TaskDetails from "../pages/TaskDetails";
import EditTask from "../pages/EditTask";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private Routes */}
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <TaskDetails />
          </PrivateRoute>
        }
      >
        {/* Nested route for editing */}
        <Route
          path="edit"
          element={
            <PrivateRoute>
              <EditTask />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
