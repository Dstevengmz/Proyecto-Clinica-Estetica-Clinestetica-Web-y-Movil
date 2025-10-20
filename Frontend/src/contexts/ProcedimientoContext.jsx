import { createContext, useContext, useState } from 'react';

export const ProcedimientoContext = createContext();

export const ProcedimientoProvider = ({ children }) => {
  const [selectedProcedimiento, setSelectedProcedimiento] = useState(null);
  return (
    <ProcedimientoContext.Provider value={{ selectedProcedimiento, setSelectedProcedimiento }}>
      {children}
    </ProcedimientoContext.Provider>
  );
};

export const useProcedimientoContext = () => useContext(ProcedimientoContext);
