import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { TOKEN_KEY } from "./api/client";
import type { Role, User } from "./types";

export const DEMO_ACCOUNTS: Record<Role, { email: string; password: string }> = {
  customer: { email: "wanjiru@example.co.ke", password: "demo1234" },
  admin: { email: "admin@lasquadradoro.co.ke", password: "demo1234" },
};

interface AuthCtx {
  user: User | null;
  ready: boolean;
  switchRole: (role: Role) => Promise<void>;
  signOut: () => void;
  setUser: (u: User) => void;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return setReady(true);
    api.me().then(setUser).catch(() => localStorage.removeItem(TOKEN_KEY)).finally(() => setReady(true));
  }, []);

  const switchRole = useCallback(async (role: Role) => {
    const { email, password } = DEMO_ACCOUNTS[role];
    const res = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    qc.clear();
    setUser(res.user);
  }, [qc]);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    qc.clear();
    setUser(null);
  }, [qc]);

  return <Ctx.Provider value={{ user, ready, switchRole, signOut, setUser }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}
