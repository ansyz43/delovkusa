import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Header from "./Header";
import SEO from "./SEO";
import ChangePasswordForm from "./ChangePasswordForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  User,
  Mail,
  BookOpen,
  LogOut,
  Calendar,
  Award,
  Shield,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName =
    user?.name || user?.email?.split("@")[0] || "Пользователь";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <SEO title="Личный кабинет" description="Личный кабинет ученика платформы Дело Вкуса" noindex />
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-4xl mx-auto"
        >
          {/* Профиль пользователя */}
          <div className="rounded-3xl border border-muted bg-background/80 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-pink-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-display font-bold mb-1">
                  Привет, {userName}!
                </h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-muted-foreground/60 text-sm mt-1">
                  Аккаунт создан:{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>

          {/* Навигация личного кабинета */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Мои курсы */}
            <Link to="/dashboard/courses" className="group">
              <Card className="h-full rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-background/80">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Мои курсы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Просмотр купленных курсов, прогресс обучения и доступ к
                    материалам
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Каталог курсов */}
            <Link to="/courses" className="group">
              <Card className="h-full rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-background/80">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Каталог курсов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Просмотр всех доступных курсов и покупка новых программ
                    обучения
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Админ-панель (только для админов) */}
            {isAdmin && (
              <Link to="/admin" className="group">
                <Card className="h-full rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-background/80 border-l-4 border-l-red-400">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">
                      Админ-панель
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Статистика, управление пользователями и заказами
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Быстрая статистика */}
          <div className="mt-8 rounded-3xl border border-muted bg-background/80 p-8">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Ваша активность
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-pink-50 rounded-2xl">
                <p className="text-3xl font-bold text-pink-600">0</p>
                <p className="text-muted-foreground text-sm mt-1">Курсов приобретено</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-2xl">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-muted-foreground text-sm mt-1">Уроков пройдено</p>
              </div>
            </div>
          </div>
          {/* Смена пароля — только для email-аккаунтов */}
          {user?.auth_provider === "email" && (
            <div className="mt-8">
              <ChangePasswordForm />
            </div>
          )}
        </motion.div>
      </main>

      <footer className="w-full border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Дело Вкуса. Все права защищены.</p>
          <div className="flex gap-4 text-xs flex-wrap justify-center">
            <Link to="/offer" className="text-muted-foreground hover:text-foreground cursor-pointer">Публичная оферта</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground cursor-pointer">Пользовательское соглашение</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground cursor-pointer">Политика конфиденциальности</Link>
          </div>
          <p className="text-xs text-muted-foreground">ИНН 253615143415</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
