import { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { initializeAuth } from "../store/actions";
import { selectAuthLoading } from "../store/selectors";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    // Initialize authentication state when the app starts
    dispatch(initializeAuth());
  }, [dispatch]);

  const value = {
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

