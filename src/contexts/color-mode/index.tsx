import { createContext, useEffect, useState, useContext, type PropsWithChildren } from "react";
import { ConfigProvider, theme } from "antd";

type ColorModeContextType = {
  mode: string,
  setMode: (mode: string) => void,
};

export const ColorModeContext = createContext<ColorModeContextType>({} as ColorModeContextType);

export const useMode = () => useContext(ColorModeContext);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(colorModeFromLocalStorage || systemPreference);

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const setColorMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  }

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        setMode: setColorMode,
      }}
    >
      <ConfigProvider
        prefixCls="a" // Default = "ant" (NOTE: Change in scss / css files too)
        iconPrefixCls="ai" // Default = "anticon" (NOTE: Change in scss / css files too)
        theme={{
          algorithm: mode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
          token: {
            fontSize: 15,
            colorBorder: '#ccc',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};
