import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isChunkError?: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    // Сбрасываем флаг после успешного монтирования, чтобы при следующей
    // chunk-ошибке reload снова отработал.
    if (sessionStorage.getItem("__chunk_reloaded")) {
      sessionStorage.removeItem("__chunk_reloaded");
    }
  }

  static getDerivedStateFromError(error: Error): State {
    const msg = String(error?.message || "");
    const isChunkError =
      msg.includes("Loading chunk") ||
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("ChunkLoadError") ||
      msg.includes("error loading dynamically imported module");
    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] render error:", error, errorInfo);

    if (this.state.isChunkError && !sessionStorage.getItem("__chunk_reloaded")) {
      sessionStorage.setItem("__chunk_reloaded", "1");
      window.location.reload();
    }
  }

  handleReload = () => {
    sessionStorage.removeItem("__chunk_reloaded");
    window.location.href = "/";
  };

  handleHardReload = () => {
    sessionStorage.removeItem("__chunk_reloaded");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // При ошибке загрузки чанка не показываем экран ошибки —
      // componentDidCatch уже запустил reload(). Показываем лоадер.
      if (this.state.isChunkError) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-50 to-white">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-400">Загрузка...</p>
          </div>
        );
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 text-center">
          <div className="max-w-md rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 text-2xl">
              !
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-800">
              Что-то пошло не так
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              Страница не загрузилась. Попробуйте обновить — это обычно помогает.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleHardReload}
                className="rounded-full bg-pink-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-700"
              >
                Обновить страницу
              </button>
              <button
                onClick={this.handleReload}
                className="rounded-full border border-pink-200 bg-white px-6 py-2.5 text-sm font-medium text-pink-600 hover:bg-pink-50"
              >
                На главную
              </button>
            </div>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-xs text-gray-400">
                  Техническая информация
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-[10px] leading-tight text-gray-600">
                  {String(this.state.error.message || this.state.error)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
