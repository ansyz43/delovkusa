import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { prefetchMainRoutes } from "./lib/prefetch";
import { AuthProvider } from "./lib/AuthContext";

const basename = import.meta.env.BASE_URL;

// ═══════════════════════════════════════════════════════════
// Защита от ошибок removeChild/insertBefore, которые вызывают
// встроенные переводчики (Edge Translate, Google Translate,
// Яндекс.Переводчик) — они подменяют текстовые ноды DOM,
// и React не может их потом удалить, падает весь экран в белый.
// ═══════════════════════════════════════════════════════════
if (typeof Node !== "undefined") {
  const origRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return (child.parentNode as Node).removeChild(child) as T;
      }
      return child;
    }
    // @ts-expect-error call original
    return origRemoveChild.call(this, child) as T;
  } as typeof Node.prototype.removeChild;

  const origInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      // @ts-expect-error call original
      return origInsertBefore.call(this, newNode, null) as T;
    }
    // @ts-expect-error call original
    return origInsertBefore.call(this, newNode, referenceNode) as T;
  } as typeof Node.prototype.insertBefore;
}

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

// Сбрасываем флаг перезагрузки после успешной загрузки страницы,
// чтобы в следующий раз auto-reload снова сработал при необходимости.
window.addEventListener("load", () => {
  setTimeout(() => {
    sessionStorage.removeItem("__chunk_reloaded");
  }, 3000);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
