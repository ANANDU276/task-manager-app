import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <ThemeProvider>
          <Router>
            <Navbar />
            <div className="">
              <AppRoutes />
            </div>
          </Router>
        </ThemeProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
