import { createContext, useContext } from "react";

export const CitasContext = createContext();
export const useCitasContext = () => useContext(CitasContext);
