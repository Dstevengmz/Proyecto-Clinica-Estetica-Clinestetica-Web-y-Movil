import { createContext, useContext } from "react";

export const ListarUsuariosContext = createContext();
export const useListarUsuariosContext = () => useContext(ListarUsuariosContext);
