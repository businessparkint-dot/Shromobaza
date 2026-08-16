"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const translations = {
  bn: {
    nav: {
      home: "হোম",
      findWorkers: "কর্মী খুঁজুন",
      browseJobs: "কাজ খুঁজুন",
      categories: "ক্যাটাগরি",
      whyUs: "কেন Shromobazar?",
      workerDashboard: "কর্মী ড্যাশবোর্ড",
      employerDashboard: "নিয়োগকর্তা ড্যাশবোর্ড",
      signIn: "সাইন ইন",
    },
    common: {
      search: "খুঁজুন",
      viewAll: "সব দেখুন",
      apply: "আবেদন করুন",
      hire: "Hire করুন",
      back: "ফিরে যান",
      loading: "লোড হচ্ছে...",
    },
  },

  en: {
    nav: {
      home: "Home",
      findWorkers: "Find Workers",
      browseJobs: "Browse Jobs",
      categories: "Categories",
      whyUs: "Why Shromobazar?",
      workerDashboard: "Worker Dashboard",
      employerDashboard: "Employer Dashboard",
      signIn: "Sign In",
    },
    common: {
      search: "Search",
      viewAll: "View All",
      apply: "Apply",
      hire: "Hire",
      back: "Back",
      loading: "Loading...",
    },
  },
} as const;

type Language = "bn" | "en";

type Translation = {
  nav: {
    home: string;
    findWorkers: string;
    browseJobs: string;
    categories: string;
    whyUs: string;
    workerDashboard: string;
    employerDashboard: string;
    signIn: string;
  };
  common: {
    search: string;
    viewAll: string;
    apply: string;
    hire: string;
    back: string;
    loading: string;
  };
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "shromobazar-language";

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("bn");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "bn" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (value: Language) => {
    setLanguage(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}