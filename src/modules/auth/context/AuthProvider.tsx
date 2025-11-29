import { createContext, useState } from "react";
import { logIn, signUp } from "../services/authService";
import { healthCheck } from "../services/healthService";
import { User, UserRegister } from "../types/auth";
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (user: User) => Promise<{ token: string | null; error: any | null }>;
  signup: (user: UserRegister) => Promise<any>;
  signout: () => void;
  health: () => Promise<bool>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");

    return Boolean(token);
  });

  const signout = (): void => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const signin = async (
    user: User,
  ): Promise<{ token: string | null; error: any }> => {
    return await logIn(user)
      .then((data) => {
        if (data) {
          setIsAuthenticated(true);
          localStorage.setItem("token", data.token);
          return { token: data.token, error: null };
        } else {
          return { error: "Invalid credentials", token: null };
        }
      })
      .catch((err) => {
        return { error: err, token: null };
      });
  };
  const signup = async (user: UserRegister) => {
    const { data, error } = await signUp(user);
    if (error) {
      return { error: error };
    } else return { data: data };
  };
  const health = async () => {
    const { data } = await healthCheck();
    return data ? true : false;
  };
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: false,
        isAuthenticated,
        signin,
        signout,
        signup,
        health,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
