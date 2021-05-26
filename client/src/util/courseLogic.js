
export const getUnitsStr = (units) => {
  return `${units[0] === units[1] ? units[0] : units.join("-")}`;
};

export const calculateTotalUnits = (courses) => {
  return courses.reduce(
    (total, course) => {
      return [total[0] + course.units[0], total[1] + course.units[1]];
    },
    [0, 0]
  );
};
