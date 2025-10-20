import { createContext, useContext } from "react";

export const HistorialClinicoContext = createContext();
export const useHistorialClinicoContext = () => useContext(HistorialClinicoContext);


