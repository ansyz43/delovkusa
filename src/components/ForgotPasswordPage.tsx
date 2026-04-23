import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import SEO from "./SEO";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const resp = await fetch(`${apiUrl}/api/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || "Ошибка запроса");
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white">
      <SEO title="Восстановление пароля" description="Восстановление доступа к аккаунту на платформе Дело Вкуса" noindex />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-pink-100 shadow-sm rounded-3xl">
            <CardContent className="p-8">
              <Link
                to="/auth"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-pink-600 mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Вернуться ко входу
              </Link>

              {sent ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-800 mb-2">Письмо отправлено</h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Если аккаунт с адресом <strong>{email}</strong> существует, вы получите письмо со
                    ссылкой для восстановления пароля. Проверьте папку «Спам».
                  </p>
                  <Link to="/auth">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full">
                      Понятно
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Забыли пароль?</h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Введите email от вашего аккаунта — мы отправим ссылку для восстановления пароля.
                  </p>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="pl-9 h-11"
                          autoComplete="email"
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
                      disabled={loading || !email}
                      className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full"
                    >
                      {loading ? "Отправка..." : "Отправить ссылку"}
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
