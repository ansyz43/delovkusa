import React from "react";
import UnifiedCourseLesson from "./UnifiedCourseLesson";
import { COURSE_ID, COURSE_TITLE, courseModules } from "../data/course-vase";

const VaseCourseLesson: React.FC = () => (
  <UnifiedCourseLesson courseId={COURSE_ID} title={COURSE_TITLE} modules={courseModules} />
);

export default VaseCourseLesson;
