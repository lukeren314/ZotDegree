import { createContext } from "react";

const CoursePlanContext = createContext({
  removeCourseById: () => {},
  highlightedCourses: [],
});

export default CoursePlanContext;
