"use client";
import {
  createContext,
  ReactNode,
  useContext,
} from "react";

type PreloaderContextType = {
  isLoading: boolean;
  loadingPercent: number;
  bypassLoading: () => void;
};

const INITIAL: PreloaderContextType = {
  isLoading: false,
  loadingPercent: 100,
  bypassLoading: () => {},
};

export const preloaderContext = createContext<PreloaderContextType>(INITIAL);

type PreloaderProps = {
  children: ReactNode;
  disabled?: boolean;
};

export const usePreloader = () => {
  const context = useContext(preloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};

function Preloader({ children, disabled = false }: PreloaderProps) {
  const bypassLoading = () => {
    // No-op
  };

  return (
    <preloaderContext.Provider
      value={{ isLoading: false, bypassLoading, loadingPercent: 100 }}
    >
      {children}
    </preloaderContext.Provider>
  );
}

export default Preloader;
