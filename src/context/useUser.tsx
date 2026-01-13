"use client";

import { SignedInUser } from "@/lib/auth/server";
import { createContext, useContext, ReactNode } from "react";

interface UserContextType {
  user: SignedInUser;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: SignedInUser;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
