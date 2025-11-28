import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    isAuthentication: context.isAuthenticated,
    logIn: context.signin,
    signOut: context.signout,
    signUp: context.signup,
    health: context.health,
  };
};
