"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, Company } from "@/app/_lib/type";

interface AuthContextProps {
  auth: User | null;
  setAuth: (auth: User) => void;
  getAuth: () => Promise<User | null>;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<User | null>(null);

  const login = (user: User) => {
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth(user);
  };

  const logout = () => {
    setAuth(null);
  };

  const getAuth = () => {
    if (auth) return auth;

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setAuth(parsedUser);
      return parsedUser;
    }

    return null;
  };

  return <AuthContext.Provider value={{ auth, setAuth, login, logout, getAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
