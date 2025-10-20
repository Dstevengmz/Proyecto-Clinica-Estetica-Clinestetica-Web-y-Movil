// src/hooks/usePacientesPorDoctor.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function usePacientesPorDoctor() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_URL}/apicitas/pacientesdoctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPacientes(res.data || []);
      } catch (err) {
        console.error("Error al listar pacientes:", err);
        setError("No se pudieron cargar los pacientes");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [token]);

  return { pacientes, cargando, error };
}

export default usePacientesPorDoctor;
