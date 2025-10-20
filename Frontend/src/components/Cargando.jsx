import { Container } from "react-bootstrap";
function Cargando({ texto = "Cargando..." }) {
  return (
    <Container>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">{texto}</p>
        </div>
      </div>
    </Container>
  );
}
export default Cargando;
