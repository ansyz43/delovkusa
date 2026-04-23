import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedCourseRoute from "./components/ProtectedCourseRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Используем ленивую загрузку для компонентов страниц
const CakeShop = lazy(() => import("./components/CakeShop"));
const Home = lazy(() => import("./components/home"));
const CourseDetail = lazy(() => import("./components/CourseDetail"));
const FinishingCreamCourse = lazy(
  () => import("./components/FinishingCreamCourse"),
);
const FlowerVaseCourse = lazy(() => import("./components/FlowerVaseCourse"));
const OstrovCourse = lazy(() => import("./components/OstrovCourse"));
const PlasticChocolateCourse = lazy(() => import("./components/PlasticChocolateCourse"));
const AuthPage = lazy(() => import("./components/AuthPage"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const DashboardCourses = lazy(() => import("./components/DashboardCourses"));
const CourseLesson = lazy(() => import("./components/CourseLesson"));
const RoseCourseLesson = lazy(() => import("./components/RoseCourseLesson"));
const OstrovCourseLesson = lazy(() => import("./components/OstrovCourseLesson"));
const VaseCourseLesson = lazy(() => import("./components/VaseCourseLesson"));
const PlasticChocolateCourseLesson = lazy(() => import("./components/PlasticChocolateCourseLesson"));
const PaymentReturn = lazy(() => import("./components/PaymentReturn"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const PublicOffer = lazy(() => import("./components/PublicOffer"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const UserAgreement = lazy(() => import("./components/UserAgreement"));
const ForgotPasswordPage = lazy(() => import("./components/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./components/ResetPasswordPage"));

function App() {
  return (
    <ErrorBoundary>
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-50 to-white">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-400">Загрузка...</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<CakeShop />} />
        <Route path="/courses" element={<Home />} />
        <Route path="/courses/roses" element={<CourseDetail />} />
        <Route path="/courses/cream" element={<FinishingCreamCourse />} />
        <Route path="/courses/vase" element={<FlowerVaseCourse />} />
        <Route path="/courses/ostrov" element={<OstrovCourse />} />
        <Route path="/courses/plastic-chocolate" element={<PlasticChocolateCourse />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/payment/return" element={<PaymentReturn />} />
        <Route path="/offer" element={<PublicOffer />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<UserAgreement />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/courses"
          element={
            <ProtectedRoute>
              <DashboardCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/courses/cream/learn"
          element={
            <ProtectedCourseRoute courseId="cream">
              <CourseLesson />
            </ProtectedCourseRoute>
          }
        />
        <Route
          path="/dashboard/courses/roses/learn"
          element={
            <ProtectedCourseRoute courseId="roses">
              <RoseCourseLesson />
            </ProtectedCourseRoute>
          }
        />
        <Route
          path="/dashboard/courses/ostrov/learn"
          element={
            <ProtectedCourseRoute courseId="ostrov">
              <OstrovCourseLesson />
            </ProtectedCourseRoute>
          }
        />
        <Route
          path="/dashboard/courses/vase/learn"
          element={
            <ProtectedCourseRoute courseId="vase">
              <VaseCourseLesson />
            </ProtectedCourseRoute>
          }
        />
        <Route
          path="/dashboard/courses/plastic-chocolate/learn"
          element={
            <ProtectedCourseRoute courseId="plastic-chocolate">
              <PlasticChocolateCourseLesson />
            </ProtectedCourseRoute>
          }
        />
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}

export default App;
