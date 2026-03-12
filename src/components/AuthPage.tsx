import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Header from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Phone, KeyRound } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (el: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

type AuthMethod = "email" | "phone";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const TELEGRAM_BOT_NAME = import.meta.env.VITE_TELEGRAM_BOT_NAME as string | undefined;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone fields
  const [phone, setPhone] = useState("+7");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithPhone, verifyOtp, loginWithGoogle, loginWithTelegram } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // --- Google Sign-In ---
  const handleGoogleCredential = useCallback(async (response: any) => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(response.credential);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ошибка входа через Google");
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const scriptId = "google-gsi-script";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      s.onload = () => initGoogle();
    } else {
      initGoogle();
    }

    function initGoogle() {
      const tryInit = () => {
        if (window.google && googleBtnRef.current) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredential,
          });
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            locale: "ru",
          });
        } else {
          setTimeout(tryInit, 200);
        }
      };
      tryInit();
    }
  }, [handleGoogleCredential]);

  // --- Telegram Login ---
  const handleTelegramLogin = useCallback(() => {
    if (!TELEGRAM_BOT_NAME) return;
    const width = 550;
    const height = 470;
    const left = Math.round(screen.width / 2 - width / 2);
    const top = Math.round(screen.height / 2 - height / 2);
    const origin = window.location.origin;
    const popup = window.open(
      `https://oauth.telegram.org/auth?bot_id=${TELEGRAM_BOT_NAME}&origin=${encodeURIComponent(origin)}&request_access=write`,
      "telegram_auth",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
    if (!popup) {
      setError("Не удалось открыть окно Telegram. Разрешите всплывающие окна.");
      return;
    }

    const onMessage = async (e: MessageEvent) => {
      if (e.origin !== "https://oauth.telegram.org") return;
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      if (data && (data.id || data.auth_date)) {
        window.removeEventListener("message", onMessage);
        setLoading(true);
        try {
          await loginWithTelegram(data);
          navigate("/dashboard");
        } catch (err: any) {
          setError(err.message || "Ошибка входа через Telegram");
        } finally {
          setLoading(false);
        }
      }
    };
    window.addEventListener("message", onMessage);

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", onMessage);
      }
    }, 500);
  }, [loginWithTelegram, navigate]);

  const formatPhoneDisplay = (value: string) => {
    let digits = value.replace(/[^\d+]/g, "");
    if (!digits.startsWith("+")) digits = "+" + digits;
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneDisplay(e.target.value);
    setPhone(formatted);
  };

  // Отправка SMS-кода
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (!cleanPhone.match(/^\+7\d{10}$/)) {
      setError("Введите корректный номер в формате +7XXXXXXXXXX");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signInWithPhone(cleanPhone);
      if (error) {
        if (error.message.includes("not enabled")) {
          setError("SMS-авторизация не настроена. Обратитесь к администратору.");
        } else {
          setError(error.message);
        }
      } else {
        setOtpSent(true);
        setSuccess("SMS-код отправлен на " + cleanPhone);
      }
    } catch (err) {
      setError("Ошибка отправки SMS. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение SMS-кода
  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!otpCode || otpCode.length < 6) {
      setError("Введите 6-значный код из SMS");
      setLoading(false);
      return;
    }

    try {
      const cleanPhone = phone.replace(/[^\d+]/g, "");
      const { error } = await verifyOtp(cleanPhone, otpCode);
      if (error) {
        if (error.message.includes("expired")) {
          setError("Код истёк. Запросите новый.");
        } else if (error.message.includes("invalid")) {
          setError("Неверный код.");
        } else {
          setError(error.message);
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Ошибка проверки кода.");
    } finally {
      setLoading(false);
    }
  };

  // Вход/регистрация по Email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message === "Invalid login credentials") {
            setError("Неверный email или пароль");
          } else {
            setError(error.message);
          }
        } else {
          navigate("/dashboard");
        }
      } else {
        if (!name.trim()) {
          setError("Пожалуйста, введите ваше имя");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("already registered") || error.message.includes("уже существует")) {
            setError("Пользователь с таким email уже зарегистрирован");
          } else {
            setError(error.message);
          }
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError("");
    setSuccess("");
    setOtpSent(false);
    setOtpCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />

      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Link>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-pink-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {authMethod === "phone"
                  ? "Вход по телефону"
                  : isLogin
                    ? "Вход в аккаунт"
                    : "Регистрация"}
              </CardTitle>
              <CardDescription className="text-gray-500">
                {authMethod === "phone"
                  ? "Введите номер телефона для получения SMS-кода"
                  : isLogin
                    ? "Войдите, чтобы получить доступ к личному кабинету"
                    : "Создайте аккаунт для доступа к курсам"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              {/* ===== СОЦИАЛЬНЫЕ КНОПКИ ===== */}
              {(GOOGLE_CLIENT_ID || TELEGRAM_BOT_NAME) && (
                <div className="space-y-3 mb-5">
                  {GOOGLE_CLIENT_ID && (
                    <div ref={googleBtnRef} className="flex justify-center" />
                  )}
                  {TELEGRAM_BOT_NAME && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTelegramLogin}
                      disabled={loading}
                      className="w-full h-11 flex items-center justify-center gap-2 border-[#54A9EB] text-[#54A9EB] hover:bg-[#54A9EB]/10 font-semibold"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                      </svg>
                      Войти через Telegram
                    </Button>
                  )}

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-400">или</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Переключатель: Email / Телефон */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => { setAuthMethod("email"); resetState(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    authMethod === "email"
                      ? "bg-white text-pink-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod("phone"); resetState(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    authMethod === "phone"
                      ? "bg-white text-pink-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Телефон
                </button>
              </div>

              {/* ===== ВХОД ПО ТЕЛЕФОНУ ===== */}
              {authMethod === "phone" && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Номер телефона
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 999 123 45 67"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="pl-10 h-11 text-lg tracking-wider"
                            maxLength={15}
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          Формат: +7XXXXXXXXXX (Россия)
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                          {error}
                        </div>
                      )}

                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                      >
                        {loading ? "Отправка..." : "Получить SMS-код"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-200 mb-2">
                        SMS-код отправлен на <strong>{phone}</strong>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-gray-700 font-medium">
                          Код из SMS
                        </Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            placeholder="123456"
                            value={otpCode}
                            onChange={(e) =>
                              setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            className="pl-10 h-11 text-xl tracking-[0.5em] text-center font-mono"
                            maxLength={6}
                            autoFocus
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                          {error}
                        </div>
                      )}

                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                      >
                        {loading ? "Проверка..." : "Подтвердить"}
                      </Button>

                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(""); setError(""); setSuccess(""); }}
                        className="w-full text-center text-sm text-gray-500 hover:text-pink-600 mt-2"
                      >
                        Изменить номер или отправить код повторно
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ===== ВХОД ПО EMAIL ===== */}
              {authMethod === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Ваше имя
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Введите ваше имя"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Пароль
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isLogin ? "Введите пароль" : "Минимум 6 символов"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-200">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                  >
                    {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
                  </Button>

                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); resetState(); }}
                        className="text-pink-600 hover:text-pink-700 font-semibold"
                      >
                        {isLogin ? "Зарегистрироваться" : "Войти"}
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
