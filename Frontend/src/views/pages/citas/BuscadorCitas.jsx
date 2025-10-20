import React, { useMemo, useEffect } from 'react';
import { CForm, CFormInput, CButton } from '@coreui/react';

  function BuscadorCitas({ citas, termino, onTerminoChange, onResultado }) {
  const filtradas = useMemo(() => {
    if (!termino.trim()) return citas;
    const t = termino.toLowerCase().trim();
    return citas.filter(c => {
      return (
        (c.id && c.id.toString().includes(t)) ||
        (c.usuario?.nombre && c.usuario.nombre.toLowerCase().includes(t)) ||
        (c.doctor?.nombre && c.doctor.nombre.toLowerCase().includes(t)) ||
        (c.tipo && c.tipo.toLowerCase().includes(t)) ||
        (c.estado && c.estado.toLowerCase().includes(t)) ||
        (c.usuario?.correo && c.usuario.correo.toLowerCase().includes(t))
      );
    });
  }, [citas, termino]);

  useEffect(() => {
    onResultado(filtradas);
  }, [filtradas, onResultado]);

  const limpiar = () => onTerminoChange('');

  return (
    <div className="mb-3">
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-center justify-content-md-between gap-2">
        <div />
        <CForm
          className="d-flex justify-content-center justify-content-md-end"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <CFormInput
            type="search"
            className="me-2"
            placeholder="Buscar por ID, usuario, doctor, tipo, estado..."
            value={termino}
            onChange={(e) => onTerminoChange(e.target.value)}
            style={{ minWidth: '300px' }}
          />
          {termino && (
            <CButton
              type="button"
              color="secondary"
              variant="outline"
              className="me-2"
              onClick={limpiar}
              title="Limpiar búsqueda"
            >
              <i className="bi bi-x-lg" />
            </CButton>
          )}
          <CButton type="button" color="success" variant="outline" title="Buscar">
            <i className="bi bi-search" />
          </CButton>
        </CForm>
      </div>
      {termino && (
        <div className="mt-3">
          <div className="alert alert-info d-flex justify-content-between align-items-center py-2 mb-0">
            <span>
              <i className="bi bi-info-circle me-2" />
              {`Mostrando ${filtradas.length} de ${citas.length} citas para "${termino}"`}
            </span>
            {filtradas.length === 0 && (
              <span className="text-muted">
                <i className="bi bi-search me-1" /> Sin coincidencias
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default BuscadorCitas;