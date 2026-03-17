import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Header from "./Header";
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />

      <main className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Профиль пользователя */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-pink-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  Привет, {userName}! 👋
                </h1>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-gray-400 text-sm mt-1">
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
              <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-800">
                    Мои курсы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">
                    Просмотр купленных курсов, прогресс обучения и доступ к
                    материалам
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Каталог курсов */}
            <Link to="/courses" className="group">
              <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-800">
                    Каталог курсов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">
                    Просмотр всех доступных курсов и покупка новых программ
                    обучения
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Админ-панель (только для админов) */}
            {isAdmin && (
              <Link to="/admin" className="group">
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-l-4 border-l-red-400">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg text-gray-800">
                      Админ-панель
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-sm">
                      Статистика, управление пользователями и заказами
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Быстрая статистика */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Ваша активность
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <p className="text-3xl font-bold text-pink-600">0</p>
                <p className="text-gray-600 text-sm mt-1">Курсов приобретено</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-gray-600 text-sm mt-1">Уроков пройдено</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
