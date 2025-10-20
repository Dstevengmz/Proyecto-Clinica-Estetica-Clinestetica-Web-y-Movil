import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthenticaContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationUsuarioProvider } from "./contexts/NotificationUsuarioContext";
import "core-js";
import "bootstrap-icons/font/bootstrap-icons.css";
import  CarritoProvider  from "./contexts/CarritoContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App";  
import store from "./store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <NotificationProvider>
        <NotificationUsuarioProvider>
          <CarritoProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CarritoProvider>
        </NotificationUsuarioProvider>
      </NotificationProvider>
    </AuthProvider>
  </Provider>
);
