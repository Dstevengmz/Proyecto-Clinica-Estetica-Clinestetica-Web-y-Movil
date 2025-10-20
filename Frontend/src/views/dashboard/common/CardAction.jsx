import React from 'react';

export default function CardAction({ id, icon, title, description, onClick, color = '#031422FF' }) {
  return (
    <div
      id={id}
      onClick={onClick}
      style={{
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: 20,
        width: 250,
        textAlign: 'center',
        backgroundColor: color,
        cursor: 'pointer',
        color: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
      }}
    >
      <div style={{ fontSize: 40 }}>{icon}</div>
      <h3 style={{ fontSize: '1.05rem', marginTop: 12 }}>{title}</h3>
      <p style={{ fontSize: '.8rem', opacity: .9 }}>{description}</p>
    </div>
  );
}
