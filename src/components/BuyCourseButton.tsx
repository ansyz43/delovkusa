import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useUserCourses } from "../lib/useUserCourses";
import { apiFetch } from "../lib/api";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { usePaymentConsent } from "./PaymentConsent";

interface BuyCourseButtonProps {
  courseId: string;
  price: string;
  learnHref: string;
  className?: string;
  /** "hero" = large button with price next to it, "cta" = inline link style */
  variant?: "hero" | "cta";
}

const BuyCourseButton: React.FC<BuyCourseButtonProps> = ({
  courseId,
  price,
  learnHref,
  className = "",
  variant = "hero",
}) => {
  const { user } = useAuth();
  const { courseIds, loading: accessLoading } = useUserCourses();
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();
  const { requestConsent, ConsentDialog } = usePaymentConsent();

  const hasAccess = courseIds.includes(courseId);

  const handleBuy = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const agreed = await requestConsent();
    if (!agreed) return;
    setBuying(true);
    try {
      const resp = await apiFetch("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({ course_id: courseId }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        alert(data.detail || "Ошибка при создании платежа");
        return;
      }
      const data = await resp.json();
      window.location.href = data.confirmation_url;
    } catch {
      alert("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBuying(false);
    }
  };

  if (variant === "cta") {
    if (accessLoading) return null;

    if (hasAccess) {
      return (
        <Link
          to={learnHref}
          className={`inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-md font-medium transition-colors ${className}`}
        >
          Перейти к курсу
        </Link>
      );
    }

    return (
      <>
        <button
          onClick={handleBuy}
          disabled={buying}
          className={`inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-md font-medium transition-colors disabled:opacity-60 ${className}`}
        >
          {buying ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Переход к оплате...
            </>
          ) : (
            `Купить за ${price}`
          )}
        </button>
        <ConsentDialog />
      </>
    );
  }

  // variant === "hero"
  if (accessLoading) {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 mt-8 ${className}`}>
        <Button className="bg-gray-300 text-gray-500 px-8 py-6 text-lg" disabled>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Загрузка...
        </Button>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 mt-8 ${className}`}>
        <Link to={learnHref}>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
            Перейти к курсу
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-4 mt-8 ${className}`}>
      <Button
        onClick={handleBuy}
        disabled={buying}
        className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg disabled:opacity-60"
      >
        {buying ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Переход к оплате...
          </>
        ) : (
          `Купить за ${price}`
        )}
      </Button>
      <div className="flex items-center text-2xl font-bold text-gray-800">
        {price}
      </div>
      <ConsentDialog />
    </div>
  );
};

export default BuyCourseButton;
