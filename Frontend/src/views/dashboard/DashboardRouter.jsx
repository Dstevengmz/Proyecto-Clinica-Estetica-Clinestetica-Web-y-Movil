import React, { Suspense, lazy } from 'react';
import { useAuth } from '../../contexts/AuthenticaContext';

const DashboardUsuario = lazy(()=>import('./DashboardUsuario'));
const DashboardDoctor = lazy(()=>import('./DashboardDoctor'));
const DashboardAsistente = lazy(()=>import('./DashboardAsistente'));

export default function DashboardRouter(){
  const { userRole } = useAuth();
  const role = (userRole || '').toLowerCase();
  let Component;
  if(role === 'doctor') Component = DashboardDoctor;
  else if(role === 'asistente') Component = DashboardAsistente;
  else Component = DashboardUsuario;
  return (
    <Suspense fallback={<div style={{padding:20}}>Cargando panel...</div>}>
      <Component />
    </Suspense>
  );
}
