import React from "react";
import { Outlet } from "react-router-dom";
import NavbarPublico from "../components/Publico/NavbarPublico";
import FooterPublico from "../components/Publico/FooterPublico";

function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPublico />
      <main className="flex-grow-1" style={{ paddingTop: '10px' }}>
        <Outlet />
      </main>
      <FooterPublico />
    </div>
  );
}


export default PublicLayout;
