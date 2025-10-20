import { useState } from 'react';
import useSubirExamenes from '../hooks/useSubirExamenes';
import useExamenesPorCita from '../hooks/useExamenesPorCita';

export default function ExamenesUpload({ idCita }) {
  const { examenes, cargando, refrescar } = useExamenesPorCita(idCita);
  const { subir, subiendo, error } = useSubirExamenes();
  const [archivos, setArchivos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [obs, setObs] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await subir({ id_cita: idCita, archivos, nombre_examen: nombre, observaciones: obs });
    setArchivos([]); setNombre(''); setObs('');
    refrescar();
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
      <h4>Exámenes</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre (opcional)" value={nombre} onChange={e=>setNombre(e.target.value)} />
        <br />
        <textarea placeholder="Observaciones" value={obs} onChange={e=>setObs(e.target.value)} />
        <br />
        <input multiple type="file" onChange={e=>setArchivos(e.target.files)} accept="image/*,application/pdf" />
        <br />
        <button disabled={subiendo || !idCita}>Subir</button>
        {subiendo && <span> Subiendo...</span>}
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
      <hr />
      {cargando ? <p>Cargando...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {examenes.map(ex => (
            <li key={ex.id} style={{ marginBottom: '.5rem' }}>
              <strong>{ex.nombre_examen}</strong>{' '}<a href={ex.archivo_examen} target="_blank" rel="noopener noreferrer">Ver</a>
              {ex.observaciones && <div style={{ fontSize: '.8rem' }}>{ex.observaciones}</div>}
            </li>
          ))}
          {examenes.length === 0 && <li>No hay exámenes</li>}
        </ul>
      )}
    </div>
  );
}
