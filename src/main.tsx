import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { prefetchMainRoutes } from "./lib/prefetch";
import { AuthProvider } from "./lib/AuthContext";

const basename = import.meta.env.BASE_URL;

// Автоматически перезагружаем страницу при ошибке загрузки чанка
// (старый HTML ссылается на уже несуществующие JS-файлы после деплоя)
window.addEventListener("error", (event) => {
  const msg = event.message || "";
  if (
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed")
  ) {
    if (!sessionStorage.getItem("__chunk_reloaded")) {
      sessionStorage.setItem("__chunk_reloaded", "1");
      window.location.reload();
    }
  }
});
window.addEventListener("unhandledrejection", (event) => {
  const msg = String(event.reason?.message || event.reason || "");
  if (
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed")
  ) {
    if (!sessionStorage.getItem("__chunk_reloaded")) {
      sessionStorage.setItem("__chunk_reloaded", "1");
      window.location.reload();
    }
  }
});

// Предварительно загружаем основные маршруты
prefetchMainRoutes();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
