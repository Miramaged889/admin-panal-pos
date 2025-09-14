import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "en";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const toggleLanguage = () => {
    setLanguage((lang) => (lang === "en" ? "ar" : "en"));
  };

  const t = (translations) => {
    if (!translations) {
      console.warn("Translation key is undefined");
      return "Translation Missing";
    }

    if (typeof translations === "string") {
      return translations;
    }

    if (typeof translations === "object" && translations !== null) {
      // Try to get the translation for current language
      const translation = translations[language];
      if (translation) {
        return translation;
      }

      // Fallback to English
      if (translations.en) {
        return translations.en;
      }

      // Fallback to Arabic
      if (translations.ar) {
        return translations.ar;
      }

      // If no translation found, return the first available value
      const firstValue = Object.values(translations)[0];
      if (firstValue) {
        return firstValue;
      }
    }

    return "Translation Missing";
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
