import { Container } from "react-bootstrap";
function ErrorCargando({ texto = "Error al cargar..." }) {
 return (
    <Container>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center text-dark">
          <p className="fs-5">{texto}</p>
        </div>
      </div>
    </Container>
  );
}
export default ErrorCargando;
