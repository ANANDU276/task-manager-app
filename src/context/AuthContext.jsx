import { createContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("authUser")) || null,
  isAuthenticated: !!localStorage.getItem("authUser"),
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authUser", JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      localStorage.removeItem("authUser");
      return { ...state, user: null, isAuthenticated: false };
    case "SIGNUP":
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = [...users, action.payload];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("authUser", JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    console.log("Auth state changed:", state);
  }, [state]);

  const login = (user) => dispatch({ type: "LOGIN", payload: user });
  const logout = () => dispatch({ type: "LOGOUT" });
  const signup = (user) => dispatch({ type: "SIGNUP", payload: user });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
