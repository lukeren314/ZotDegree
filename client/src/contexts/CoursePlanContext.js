import { createContext } from "react";

const CoursePlanContext = createContext({
  removeCourseById: () => {},
});

export default CoursePlanContext;
