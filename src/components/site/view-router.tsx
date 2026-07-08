"use client";

import * as React from "react";

/** Parsed view route */
export interface ViewRoute {
  /** view name: home | shop | product | cart | checkout | admin */
  view: "home" | "shop" | "product" | "cart" | "checkout" | "admin";
  /** for product view, the slug */
  slug?: string;
  /** for shop view, parsed query params */
  query?: Record<string, string>;
}

function parseHash(hash: string): ViewRoute {
  const clean = hash.replace(/^#\/?/, "");
  if (!clean) return { view: "home" };

  const [path, queryString] = clean.split("?");
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { view: "home" };

  if (parts[0] === "shop") {
    const query: Record<string, string> = {};
    if (queryString) {
      new URLSearchParams(queryString).forEach((v, k) => {
        query[k] = v;
      });
    }
    return { view: "shop", query };
  }

  if (parts[0] === "product" && parts[1]) {
    return { view: "product", slug: parts[1] };
  }

  if (parts[0] === "cart") return { view: "cart" };
  if (parts[0] === "checkout") return { view: "checkout" };
  if (parts[0] === "admin") return { view: "admin" };

  return { view: "home" };
}

function toHash(route: ViewRoute): string {
  switch (route.view) {
    case "home":
      return "#/";
    case "shop": {
      const qs = route.query
        ? new URLSearchParams(route.query).toString()
        : "";
      return qs ? `#/shop?${qs}` : "#/shop";
    }
    case "product":
      return route.slug ? `#/product/${route.slug}` : "#/";
    case "cart":
      return "#/cart";
    case "checkout":
      return "#/checkout";
    case "admin":
      return "#/admin";
    default:
      return "#/";
  }
}

interface RouterValue {
  route: ViewRoute;
  navigate: (route: ViewRoute) => void;
  back: () => void;
}

const RouterContext = React.createContext<RouterValue | null>(null);

export function ViewRouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = React.useState<ViewRoute>(() =>
    parseHash(typeof window === "undefined" ? "" : window.location.hash)
  );

  React.useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash));
      // Scroll to top on every navigation
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHashChange);
    // Ensure initial hash is set
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/");
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = React.useCallback((next: ViewRoute) => {
    const hash = toHash(next);
    if (hash === window.location.hash) {
      // Same route — force scroll top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = hash;
    }
  }, []);

  const back = React.useCallback(() => {
    window.history.back();
  }, []);

  const value = React.useMemo(
    () => ({ route, navigate, back }),
    [route, navigate, back]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useViewRouter() {
  const ctx = React.useContext(RouterContext);
  if (!ctx) throw new Error("useViewRouter must be used inside ViewRouterProvider");
  return ctx;
}

/** Convenience hook for anchor-style navigation links */
export function useViewLink() {
  const { navigate } = useViewRouter();
  return React.useCallback(
    (route: ViewRoute) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      navigate(route);
    },
    [navigate]
  );
}
