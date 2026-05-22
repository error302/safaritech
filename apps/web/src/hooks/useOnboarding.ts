"use client";

import { useState, useEffect } from "react";

export function useOnboarding() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem("has_visited_safaritech");
    if (!hasVisited) {
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("has_visited_safaritech", "true");
    setIsFirstVisit(false);
  };

  return { isFirstVisit, completeOnboarding };
}
