import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useCambiarEstadoCita() {
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);

	const cambiarEstadoCita = async (id, estado = "realizada") => {
		const token = localStorage.getItem("token");
		if (!token) {
			setError("No hay token de autenticación");
			return null;
		}
		setCargando(true);
		setError(null);
		try {
			const { data } = await axios.patch(
				`${API_URL}/apicitas/editarestadocita/${id}`,
				{ estado },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return data;
		} catch (e) {
			console.error("Error al cambiar estado de cita:", e);
			const msg = e.response?.data?.error || e.response?.data?.mensaje || "Error al cambiar el estado";
			setError(msg);
			return null;
		} finally {
			setCargando(false);
		}
	};

	return { cambiarEstadoCita, cargando, error };
}

export default useCambiarEstadoCita;

