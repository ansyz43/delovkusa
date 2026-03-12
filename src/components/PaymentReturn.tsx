import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import Header from "./Header";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"loading" | "succeeded" | "canceled" | "pending">("loading");
  const [courseId, setCourseId] = useState<string>("");

  useEffect(() => {
    if (!orderId) {
      setStatus("canceled");
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const poll = async () => {
      try {
        const resp = await apiFetch(`/api/payments/status/${orderId}`);
        if (!resp.ok) {
          setStatus("canceled");
          return;
        }
        const data = await resp.json();
        setCourseId(data.course_id);

        if (data.status === "succeeded") {
          setStatus("succeeded");
          return;
        }
        if (data.status === "canceled") {
          setStatus("canceled");
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("canceled");
      }
    };

    poll();
  }, [orderId]);

  const courseHref: Record<string, string> = {
    roses: "/dashboard/courses/roses/learn",
    cream: "/dashboard/courses/cream/learn",
    vase: "/dashboard/courses/vase/learn",
    ostrov: "/dashboard/courses/ostrov/learn",
    "plastic-chocolate": "/dashboard/courses/plastic-chocolate/learn",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          {status === "loading" && (
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <Loader2 className="w-16 h-16 text-pink-600 animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Проверяем оплату...</h1>
              <p className="text-gray-500">Подождите, это займёт несколько секунд</p>
            </div>
          )}

          {status === "succeeded" && (
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Оплата прошла успешно!</h1>
              <p className="text-gray-500 mb-8">Курс добавлен в ваш личный кабинет</p>
              {courseId && courseHref[courseId] ? (
                <Link to={courseHref[courseId]}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                    Перейти к курсу
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/courses">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg">
                    Мои курсы
                  </Button>
                </Link>
              )}
            </div>
          )}

          {status === "canceled" && (
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Оплата отменена</h1>
              <p className="text-gray-500 mb-8">Вы можете попробовать снова</p>
              <Link to="/courses">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg">
                  Вернуться к курсам
                </Button>
              </Link>
            </div>
          )}

          {status === "pending" && (
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Оплата обрабатывается</h1>
              <p className="text-gray-500 mb-8">
                Статус платежа обновится автоматически. Проверьте позже в личном кабинете.
              </p>
              <Link to="/dashboard/courses">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg">
                  Мои курсы
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentReturn;
