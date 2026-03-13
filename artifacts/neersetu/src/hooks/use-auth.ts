import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { STORAGE_KEYS } from "@/lib/data";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "provider" | "ngo";
  location?: string;
  phone?: string;
  organizationName?: string;
  serviceArea?: string;
}

const REGISTERED_KEY = "neersetu_users";

function getRegistered(): Array<AuthUser & { password: string }> {
  try { return JSON.parse(localStorage.getItem(REGISTERED_KEY) || "[]"); }
  catch { return []; }
}

export function getStoredUser(): AuthUser | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null"); }
  catch { return null; }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function useAuth() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const users = getRegistered();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password" };
    const { password: _, ...userData } = found;
    setStoredUser(userData);
    setUser(userData);
    return { success: true };
  }, []);

  const register = useCallback((data: {
    name: string; email: string; password: string;
    role: "user" | "provider" | "ngo";
    location?: string; phone?: string;
    organizationName?: string; serviceArea?: string;
  }): { success: boolean; error?: string } => {
    const users = getRegistered();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }
    const newUser: AuthUser & { password: string } = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      location: data.location,
      phone: data.phone,
      organizationName: data.organizationName,
      serviceArea: data.serviceArea,
    };
    localStorage.setItem(REGISTERED_KEY, JSON.stringify([...users, newUser]));
    const { password: _, ...userData } = newUser;
    setStoredUser(userData);
    setUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setLocation("/");
  }, [setLocation]);

  return { user, isAuthenticated: !!user, login, register, logout };
}
