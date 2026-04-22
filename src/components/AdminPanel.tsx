import React, { useEffect, useState, useCallback } from "react";
import SEO from "./SEO";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { apiFetch } from "../lib/api";
import Header from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Users,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  DollarSign,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────

interface AdminUser {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  auth_provider: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string | null;
}

interface AdminOrder {
  id: number;
  user_email: string;
  user_name: string;
  course_title: string;
  course_id: string;
  amount: number;
  status: string;
  yookassa_payment_id: string | null;
  created_at: string | null;
}

interface CourseStats {
  title: string;
  course_id: string;
  orders: number;
  revenue: number;
}

interface DailyRevenue {
  date: string;
  orders: number;
  revenue: number;
}

interface DailyReg {
  date: string;
  count: number;
}

interface Stats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  course_stats: CourseStats[];
  daily_revenue: DailyRevenue[];
  daily_registrations: DailyReg[];
}

interface AdminCourse {
  id: string;
  title: string;
  price: number;
  product_type: string;
  is_active: boolean;
}

interface UserCourseInfo {
  course_id: string;
  title: string;
  granted_at: string | null;
}

// ── Main Component ─────────────────────────────────────────────────────

const AdminPanel: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate("/dashboard");
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <SEO title="Панель администратора" description="Админ-панель" noindex />
      <Header />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Панель администратора
          </h1>
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="stats" className="gap-1">
                <BarChart3 className="w-4 h-4" /> Статистика
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1">
                <Users className="w-4 h-4" /> Пользователи
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1">
                <ShoppingCart className="w-4 h-4" /> Заказы
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <StatsTab />
            </TabsContent>
            <TabsContent value="users">
              <UsersTab />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

// ── Stats Tab ──────────────────────────────────────────────────────────

const StatsTab: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const resp = await apiFetch("/api/admin/stats");
      if (resp.ok) setStats(await resp.json());
      setLoading(false);
    })();
  }, []);

  if (loading)
    return <p className="text-gray-400 text-center py-12">Загрузка...</p>;
  if (!stats) return <p className="text-red-500 text-center py-12">Ошибка загрузки</p>;

  const maxRevenue = Math.max(...stats.daily_revenue.map((d) => d.revenue), 1);
  const maxRegs = Math.max(...stats.daily_registrations.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{stats.total_users}</p>
            <p className="text-sm text-gray-500">Пользователей</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{stats.total_orders}</p>
            <p className="text-sm text-gray-500">Успешных заказов</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">
              {stats.total_revenue.toLocaleString("ru-RU")} ₽
            </p>
            <p className="text-sm text-gray-500">Общая выручка</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by course */}
      {stats.course_stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" /> Выручка по
              курсам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.course_stats.map((cs) => (
                <div key={cs.course_id} className="flex items-center gap-3">
                  <span className="w-48 text-sm text-gray-700 truncate">
                    {cs.title}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-pink-500 h-full rounded-full transition-all"
                      style={{
                        width: `${(cs.revenue / (stats.total_revenue || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-28 text-right">
                    {cs.revenue.toLocaleString("ru-RU")} ₽ ({cs.orders})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily revenue chart (simple bar) */}
      {stats.daily_revenue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" /> Выручка за 30
              дней
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {stats.daily_revenue.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-blue-400 rounded-t hover:bg-blue-600 transition-colors cursor-default group relative"
                  style={{
                    height: `${(d.revenue / maxRevenue) * 100}%`,
                    minHeight: d.revenue > 0 ? "4px" : "0",
                  }}
                  title={`${d.date}: ${d.revenue.toLocaleString("ru-RU")} ₽ (${d.orders} заказов)`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily registrations chart */}
      {stats.daily_registrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" /> Регистрации за
              30 дней
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-24">
              {stats.daily_registrations.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-purple-400 rounded-t hover:bg-purple-600 transition-colors cursor-default"
                  style={{
                    height: `${(d.count / maxRegs) * 100}%`,
                    minHeight: d.count > 0 ? "4px" : "0",
                  }}
                  title={`${d.date}: ${d.count} регистраций`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ── Users Tab ──────────────────────────────────────────────────────────

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const perPage = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    const resp = await apiFetch(`/api/admin/users?${params}`);
    if (resp.ok) {
      const data = await resp.json();
      setUsers(data.users);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск по email или имени..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-gray-500">
          Всего: {total}
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead className="hidden md:table-cell">Провайдер</TableHead>
                <TableHead className="hidden lg:table-cell">Дата</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <React.Fragment key={u.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-pink-50 transition-colors"
                      onClick={() =>
                        setExpandedUser(expandedUser === u.id ? null : u.id)
                      }
                    >
                      <TableCell className="font-mono text-xs">{u.id}</TableCell>
                      <TableCell className="text-sm">{u.email}</TableCell>
                      <TableCell className="text-sm">{u.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {u.auth_provider || "email"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-gray-500">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("ru-RU")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {expandedUser === u.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedUser === u.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 p-4">
                          <UserCoursesPanel userId={u.id} userName={u.name} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// ── User's Courses Sub-panel ───────────────────────────────────────────

const UserCoursesPanel: React.FC<{ userId: number; userName: string }> = ({
  userId,
  userName,
}) => {
  const [courses, setCourses] = useState<UserCourseInfo[]>([]);
  const [allCourses, setAllCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [granting, setGranting] = useState(false);

  const load = useCallback(async () => {
    const [cResp, allResp] = await Promise.all([
      apiFetch(`/api/admin/users/${userId}/courses`),
      apiFetch("/api/admin/courses"),
    ]);
    if (cResp.ok) setCourses((await cResp.json()).courses);
    if (allResp.ok) setAllCourses((await allResp.json()).courses);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const grantedIds = new Set(courses.map((c) => c.course_id));
  const available = allCourses.filter((c) => !grantedIds.has(c.id));

  const grant = async (courseId: string) => {
    setGranting(true);
    await apiFetch(
      `/api/admin/users/${userId}/grant-course?course_id=${encodeURIComponent(courseId)}`,
      { method: "POST" },
    );
    await load();
    setGranting(false);
  };

  const revoke = async (courseId: string) => {
    if (!confirm("Отозвать доступ?")) return;
    await apiFetch(
      `/api/admin/users/${userId}/revoke-course?course_id=${encodeURIComponent(courseId)}`,
      { method: "DELETE" },
    );
    await load();
  };

  if (loading)
    return <p className="text-sm text-gray-400">Загрузка курсов...</p>;

  return (
    <div className="space-y-3">
      <p className="font-medium text-sm text-gray-700">
        Курсы пользователя {userName}:
      </p>
      {courses.length === 0 ? (
        <p className="text-sm text-gray-400">Нет доступных курсов</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <Badge
              key={c.course_id}
              className="gap-1 cursor-pointer hover:bg-red-100"
              onClick={() => revoke(c.course_id)}
              title="Нажмите чтобы отозвать доступ"
            >
              <BookOpen className="w-3 h-3" /> {c.title} ✕
            </Badge>
          ))}
        </div>
      )}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-gray-500 w-full">Выдать доступ:</span>
          {available.map((c) => (
            <Button
              key={c.id}
              variant="outline"
              size="sm"
              disabled={granting}
              onClick={() => grant(c.id)}
              className="text-xs"
            >
              + {c.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Orders Tab ─────────────────────────────────────────────────────────

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const perPage = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (statusFilter) params.set("status", statusFilter);
    const resp = await apiFetch(`/api/admin/orders?${params}`);
    if (resp.ok) {
      const data = await resp.json();
      setOrders(data.orders);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / perPage);

  const statusColor = (s: string) => {
    if (s === "succeeded") return "bg-green-100 text-green-700";
    if (s === "canceled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {["", "succeeded", "pending", "canceled"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
            >
              {s === "" ? "Все" : s === "succeeded" ? "Оплачено" : s === "pending" ? "Ожидание" : "Отменено"}
            </Button>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-auto">Всего: {total}</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead className="hidden md:table-cell">Курс</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden lg:table-cell">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Заказов нет
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell>
                      <div className="text-sm">{o.user_name}</div>
                      <div className="text-xs text-gray-400">{o.user_email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {o.course_title}
                    </TableCell>
                    <TableCell className="font-medium">
                      {o.amount.toLocaleString("ru-RU")} ₽
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColor(o.status)}>
                        {o.status === "succeeded"
                          ? "Оплачено"
                          : o.status === "pending"
                            ? "Ожидание"
                            : "Отменено"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-gray-500">
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString("ru-RU")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
