import { createContext, useContext } from "react";

export const CategoriaContext = createContext({
  selectedCategoria: null,
  setSelectedCategoria: () => {},
});

export const useCategoriaContext = () => useContext(CategoriaContext);
