import { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English" },
  { code: "tr", name: "Türkçe" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-selector">
      <button type="button" className="language-button" onClick={() => setIsOpen(!isOpen)}>
        <span>🌐</span>
        <span>{currentLanguage?.name}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${lang.code === i18n.language ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang.code)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleLanguageChange(lang.code);
                }
              }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
