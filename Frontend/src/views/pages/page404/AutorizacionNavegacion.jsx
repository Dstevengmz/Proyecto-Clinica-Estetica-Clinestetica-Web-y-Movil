import React from "react";

function PermisosNavegacionFrontendDenegado() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.icon}>🚫</h1>
        <h2 style={styles.title}>Acceso denegado</h2>
        <p style={styles.message}>No tienes permisos para acceder a esta página.</p>
        <button style={styles.button} onClick={handleBack}>
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "10px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    color: "#c0392b",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default PermisosNavegacionFrontendDenegado;
