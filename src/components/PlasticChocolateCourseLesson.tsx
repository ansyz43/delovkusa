import React from "react";
import UnifiedCourseLesson from "./UnifiedCourseLesson";
import { COURSE_ID, COURSE_TITLE, courseModules } from "../data/course-plastic-chocolate";

const PlasticChocolateCourseLesson: React.FC = () => (
  <UnifiedCourseLesson courseId={COURSE_ID} title={COURSE_TITLE} modules={courseModules} />
);

export default PlasticChocolateCourseLesson;
