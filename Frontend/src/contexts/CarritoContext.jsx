import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

 const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const token = localStorage.getItem("token");

const cargarCarritoDesdeBackend = async () => {
  try {
    const res = await axios.get(`${API_URL}/apicarrito/listarmicarrito`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setCarrito(res.data);
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
};

const estaEnCarrito = (id_procedimiento) =>
  carrito?.some(
    (item) =>
      item?.procedimiento?.id === id_procedimiento ||
      item?.id_procedimiento === id_procedimiento
  );

const agregarAlCarrito = async (id_procedimiento) => {
  try {
    if (estaEnCarrito(id_procedimiento)) {
      return { added: false, reason: "already-in-cart" };
    }

    const res = await axios.post(
      `${API_URL}/apicarrito/agregaramicarrito`,
      { id_procedimiento },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setCarrito((prev) => [...prev, res.data]);
    return { added: true };
  } catch (error) {
    const msg = error?.response?.data?.error || error?.message;
    const status = error?.response?.status;
    if (
      status === 400 &&
      typeof msg === "string" &&
      msg.toLowerCase().includes("ya está en el carrito")
    ) {
      return { added: false, reason: "already-in-cart" };
    }
    console.error("Error al agregar al carrito:", error);
    return { added: false, reason: "error", error };
  }
};

const eliminarDelCarrito = async (idCarrito) => {
  try {
    await axios.delete(`${API_URL}/apicarrito/eliminardemicarrito/${idCarrito}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setCarrito((prev) => prev.filter((item) => item.id !== idCarrito));
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
  }
};

const limpiarCarrito = async () => {
  try {
    await axios.delete(`${API_URL}/apicarrito/limpiarmicarrito`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setCarrito([]);
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
  }
};

  useEffect(() => {
    if (token) cargarCarritoDesdeBackend();
  }, [token]);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        cargarCarritoDesdeBackend,
        limpiarCarrito,
        estaEnCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoProvider; 