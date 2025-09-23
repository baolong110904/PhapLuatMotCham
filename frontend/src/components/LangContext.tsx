import { createContext } from "react";

export const LangContext = createContext({ lang: "vi", setLang: (_lang: string) => {} });