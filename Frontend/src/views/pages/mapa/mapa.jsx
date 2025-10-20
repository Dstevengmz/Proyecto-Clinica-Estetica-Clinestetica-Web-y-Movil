import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { Button, Alert, Spinner } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultLeafletIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const containerStyle = {
  width: "100%",
  height: "400px",
};

const clinicaUbicacion = [2.444814, -76.614739];

function MapaConRuta() {
  const [posCliente, setPosCliente] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [error, setError] = useState(null);
  const [solicitandoUbicacion, setSolicitandoUbicacion] = useState(false);
  // Seguimiento en tiempo real
  const [tracking, setTracking] = useState(false);
  const [livePath, setLivePath] = useState([]);
  const [followUser, setFollowUser] = useState(true);
  const watchIdRef = useRef(null);
  const [map, setMap] = useState(null);

  const solicitarUbicacion = () => {
    setSolicitandoUbicacion(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("La geolocalización no está disponible en este navegador");
      setSolicitandoUbicacion(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const origen = [pos.coords.latitude, pos.coords.longitude];
          setPosCliente(origen);

          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${clinicaUbicacion[1]},${clinicaUbicacion[0]}?overview=full&geometries=geojson`
          );
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c) => [
              c[1],
              c[0],
            ]);
            setRuta(coords);
          } else {
            setError("No se pudo calcular la ruta");
          }
        } catch {
          setError("Error al obtener la ruta");
        } finally {
          setSolicitandoUbicacion(false);
        }
      },
      (err) => {
        setSolicitandoUbicacion(false);
        let errorMessage = "No se pudo obtener tu ubicación. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage +=
              "Permiso denegado. Activa la ubicación en tu navegador.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Ubicación no disponible.";
            break;
          case err.TIMEOUT:
            errorMessage += "Tiempo de espera agotado.";
            break;
          default:
            errorMessage += "Error desconocido.";
        }
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Iniciar seguimiento en tiempo real
  const iniciarSeguimiento = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("La geolocalización no está disponible en este navegador");
      return;
    }
    if (watchIdRef.current !== null) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const nuevaPos = [pos.coords.latitude, pos.coords.longitude];
        setPosCliente(nuevaPos);
        setLivePath((prev) => [...prev, nuevaPos]);
        if (followUser && map) {
          map.panTo(nuevaPos);
        }
      },
      (err) => {
        let errorMessage = "No se pudo obtener tu ubicación en tiempo real. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage +=
              "Permiso denegado. Activa la ubicación en tu navegador.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Ubicación no disponible.";
            break;
          case err.TIMEOUT:
            errorMessage += "Tiempo de espera agotado.";
            break;
          default:
            errorMessage += "Error desconocido.";
        }
        setError(errorMessage);
        detenerSeguimiento();
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
    watchIdRef.current = id;
    setTracking(true);
  };

  // Detener seguimiento en tiempo real
  const detenerSeguimiento = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  };

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div>
      <MapContainer
        center={clinicaUbicacion}
        zoom={14}
        style={containerStyle}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={clinicaUbicacion} icon={defaultLeafletIcon}>
          <Popup>Clínica</Popup>
        </Marker>
        {posCliente && (
          <Marker position={posCliente} icon={defaultLeafletIcon}>
            <Popup>Tú</Popup>
          </Marker>
        )}
        {ruta && <Polyline positions={ruta} color="blue" />}
        {livePath.length > 1 && (
          <Polyline positions={livePath} color="green" />
        )}{" "}
        {/* Trayectoria en tiempo real */}
      </MapContainer>

      <div className="text-center mt-3">

        {/* Controles de seguimiento en tiempo real */}
        {/* Controles en una sola fila */}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3 flex-wrap">
          {!posCliente && !error && (
            <Button
              variant="dark"
              onClick={solicitarUbicacion}
              disabled={solicitandoUbicacion}
            >
              {solicitandoUbicacion ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Obteniendo ubicación...
                </>
              ) : (
                <>Obtener ubicación</>
              )}
            </Button>
          )}

          <Button
            variant={tracking ? "dark" : "dark"}
            onClick={tracking ? detenerSeguimiento : iniciarSeguimiento}
          >
            {tracking ? "Detener seguimiento" : "Iniciar seguimiento"}
          </Button>

          <div className="form-check d-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id="seguirUsuario"
              checked={followUser}
              onChange={(e) => setFollowUser(e.target.checked)}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor="seguirUsuario"
            >
              Seguir mi posición
            </label>
          </div>
        </div>

        {error && (
          <Alert variant="warning" className="mt-3">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default MapaConRuta;
