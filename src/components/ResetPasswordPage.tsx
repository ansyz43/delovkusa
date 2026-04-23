import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import SEO from "./SEO";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenMissing = !token;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const resp = await fetch(`${apiUrl}/api/auth/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || "Ошибка сброса пароля");
      }
      setDone(true);
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err: any) {
      setError(err.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white">
      <SEO title="Сброс пароля" description="Установка нового пароля для аккаунта Дело Вкуса" noindex />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-pink-100 shadow-sm rounded-3xl">
            <CardContent className="p-8">
              {tokenMissing ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-800 mb-2">Ссылка недействительна</h1>
                  <p className="text-sm text-gray-500 mb-6">
                    В адресе нет токена восстановления. Запросите новую ссылку.
                  </p>
                  <Link to="/forgot-password">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full">
                      Запросить ссылку
                    </Button>
                  </Link>
                </div>
              ) : done ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-800 mb-2">Пароль обновлён</h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Перенаправляем на страницу входа...
                  </p>
                  <Link to="/auth">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full">
                      Войти сейчас
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Новый пароль</h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Придумайте надёжный пароль: минимум 8 символов, буквы и цифры.
                  </p>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="password">Новый пароль</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Минимум 8 символов"
                          className="pl-9 pr-10 h-11"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm">Подтвердите пароль</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="confirm"
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="Повторите пароль"
                          className="pl-9 h-11"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || !password || !confirm}
                      className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full"
                    >
                      {loading ? "Сохранение..." : "Сохранить пароль"}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
