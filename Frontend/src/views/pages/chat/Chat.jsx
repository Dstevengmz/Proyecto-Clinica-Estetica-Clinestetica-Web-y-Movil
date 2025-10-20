import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hola, soy tu asistente. Pregunta por un procedimiento o categoría.' }
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const resp = await axios.post(`${API}/apichat/consultar`, { mensaje: text });
  const data = resp.data;
      if (!data.ok) throw new Error(data.mensaje || 'Error');
  const items = Array.isArray(data.items) ? data.items.slice(0,5) : [];
  setMessages(prev => [...prev, { role: 'bot', text: data.respuesta, items }]);
    } catch (error) {
      const msg = error?.response?.data?.mensaje || 'Ocurrió un error. Inténtalo de nuevo más tarde.';
      setMessages(prev => [...prev, { role: 'bot', text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1000 }}>
      {!open && (
        <button onClick={() => setOpen(true)} style={btnStyle}>Chat</button>
      )}
      {open && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <strong>Asistente</strong>
            <button onClick={() => setOpen(false)} style={closeStyle}>×</button>
          </div>
          <div ref={listRef} style={listStyle}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {m.text && (
                  <div style={{ ...msgStyle, background: m.role === 'user' ? '#DCF8C6' : '#FFF' }}>
                    {m.text}
                  </div>
                )}
                {m.items && m.items.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {m.items.map((it) => (
                      <button
                        key={it.id}
                        onClick={() => navigate(`/servicios/${it.id}`)}
                        style={cardBtnStyle}
                        title={`Ver detalles de ${it.nombre}`}
                      >
                        <div style={{ display: 'flex', gap: 8 }}>
                          {it.imagen && (
                            <img src={it.imagen} alt={it.nombre} style={thumbStyle} onError={(e)=>{e.currentTarget.style.display='none'}} />
                          )}
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600 }}>{it.nombre}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{it.categoria || 'Sin categoría'}</div>
                            {typeof it.precio === 'number' && (
                              <div style={{ fontSize: 12, color: '#0d6efd', marginTop: 2 }}>
                                ${it.precio.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ fontSize: 12, color: '#666' }}>Buscando…</div>}
          </div>
          <div style={inputRow}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Escribe tu pregunta…" style={textStyle} rows={2} />
            <button onClick={send} disabled={loading} style={sendStyle}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = { background:'#0d6efd', color:'#fff', border:'none', borderRadius:24, padding:'10px 16px', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.2)'};
const panelStyle = { width: 320, height: 420, background:'#f7f7f7', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,.2)', display:'flex', flexDirection:'column' };
const headerStyle = { padding:'8px 12px', borderBottom:'1px solid #ddd', display:'flex', justifyContent:'space-between', alignItems:'center' };
const closeStyle = { background:'transparent', border:'none', fontSize:18, cursor:'pointer' };
const listStyle = { flex:1, overflowY:'auto', padding:12, display:'flex', flexDirection:'column', gap:8 };
const msgStyle = { maxWidth:'80%', padding:'8px 10px', borderRadius:8, fontSize:14, border:'1px solid #eee' };
const inputRow = { display:'flex', gap:8, padding:8, borderTop:'1px solid #ddd', background:'#fff' };
const textStyle = { flex:1, resize:'none', borderRadius:6, border:'1px solid #ccc', padding:8 };
const sendStyle = { background:'#0d6efd', color:'#fff', border:'none', borderRadius:6, padding:'8px 12px', cursor:'pointer' };
const cardBtnStyle = { width:'100%', textAlign:'left', background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, padding:8, cursor:'pointer', boxShadow:'0 1px 3px rgba(0,0,0,.08)' };
const thumbStyle = { width:48, height:48, borderRadius:6, objectFit:'cover', flexShrink:0 };