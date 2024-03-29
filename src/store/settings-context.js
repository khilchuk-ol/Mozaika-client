import { createContext, useEffect, useState } from "react";

import useCookies from "../hooks/use-cookies";
import themes from "../settings/themes-data";
import langs from "../settings/lang-data";

const INIT_STATE = {
  theme: "default",
  themeFile: "",
  lang: "english",
  languages: ["english"],
  changeTheme: (theme) => {},
  changeLang: (lang) => {},
};

const SettingsContext = createContext(INIT_STATE);

export const SettingsContextProvider = (props) => {
  const [getCookies, setCookies] = useCookies();

  const [theme, setTheme] = useState("default");
  const [themeFile, setThemeFile] = useState("");
  const [lang, setLang] = useState("english");

  const languages = Object.keys(langs).sort();

  useEffect(() => {
    const settingsData = getCookies("mozaika-stg");

    if (!settingsData) {
      setCookies("mozaika-stg", { theme, lang });
    } else {
      if (settingsData.theme) {
        setTheme(settingsData.theme);
      }

      if (settingsData.lang) {
        setLang(settingsData.lang);
      }
    }

    const found = themes[theme];

    if (!found) {
      console.error("Theme not found!!");
    } else {
      setThemeFile(found);
    }
  }, [theme, lang, getCookies, setCookies]);

  const handleThemeChange = (newTheme) => {
    setCookies("mozaika-stg", { lang, theme: newTheme });
    setTheme(newTheme);
  };

  const handleLangChange = (newLang) => {
    setCookies("mozaika-stg", { lang: newLang, theme });
    setLang(newLang);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        themeFile,
        lang,
        languages,
        changeTheme: handleThemeChange,
        changeLang: handleLangChange,
      }}>
      {props.children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
