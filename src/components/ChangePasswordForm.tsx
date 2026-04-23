import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { apiFetch } from "../lib/api";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDone(false);

    if (next.length < 8) {
      setError("Новый пароль должен содержать минимум 8 символов");
      return;
    }
    if (next !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const resp = await apiFetch("/api/auth/password-change", {
        method: "POST",
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || "Ошибка смены пароля");
      }
      setDone(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err: any) {
      setError(err.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Смена пароля</h2>
      <p className="text-sm text-gray-500 mb-5">
        Введите текущий пароль и новый — минимум 8 символов, буквы и цифры.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cp-current">Текущий пароль</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="cp-current"
              type={show ? "text" : "password"}
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="pl-9 pr-10 h-11"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="cp-next">Новый пароль</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="cp-next"
              type={show ? "text" : "password"}
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Минимум 8 символов"
              className="pl-9 h-11"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cp-confirm">Подтвердите новый пароль</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="cp-confirm"
              type={show ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
        {done && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Пароль успешно обновлён
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !current || !next || !confirm}
          className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full"
        >
          {loading ? "Сохранение..." : "Сохранить новый пароль"}
        </Button>
      </form>
    </div>
  );
}
