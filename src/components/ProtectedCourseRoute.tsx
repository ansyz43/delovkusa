import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useUserCourses } from "../lib/useUserCourses";

interface ProtectedCourseRouteProps {
  courseId: string;
  children: React.ReactNode;
}

const ProtectedCourseRoute: React.FC<ProtectedCourseRouteProps> = ({ courseId, children }) => {
  const { user, loading: authLoading } = useAuth();
  const { courseIds, loading: coursesLoading } = useUserCourses();

  if (authLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!courseIds.includes(courseId)) {
    return <Navigate to={`/courses/${courseId}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedCourseRoute;
