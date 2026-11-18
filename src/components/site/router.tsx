"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { RouteId } from "@/lib/site-data";

const ROUTES: RouteId[] = [
  "home",
  "downloads",
  "docs",
  "api",
  "community",
  "changelog",
];

interface RouterState {
  view: RouteId;
  sub: string | null;
  navigate: (view: RouteId, sub?: string) => void;
}

const RouterContext = createContext<RouterState>({
  view: "home",
  sub: null,
  navigate: () => {},
});

function parseHash(): { view: RouteId; sub: string | null } {
  if (typeof window === "undefined") return { view: "home", sub: null };
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [head, ...rest] = raw.split("/");
  const view = (ROUTES as string[]).includes(head)
    ? (head as RouteId)
    : "home";
  const sub = rest.length > 0 && rest[0] !== "" ? rest.join("/") : null;
  return { view, sub };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ view: RouteId; sub: string | null }>({
    view: "home",
    sub: null,
  });

  useEffect(() => {
    const onHash = () => setState(parseHash());
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((view: RouteId, sub?: string) => {
    const target = `#/${view}${sub ? `/${sub}` : ""}`;
    if (window.location.hash === target) {
      setState({ view, sub: sub ?? null });
      return;
    }
    window.location.hash = target;
    setState({ view, sub: sub ?? null });
  }, []);

  const value = useMemo(
    () => ({ view: state.view, sub: state.sub, navigate }),
    [state, navigate]
  );

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
