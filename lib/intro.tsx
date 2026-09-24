"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type IntroPhase = "intro" | "reveal" | "ready";

type IntroContextValue = {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("intro");

  return (
    <IntroContext.Provider value={{ phase, setPhase }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const value = useContext(IntroContext);
  if (!value) {
    throw new Error("useIntro must be used within IntroProvider");
  }
  return value;
}
