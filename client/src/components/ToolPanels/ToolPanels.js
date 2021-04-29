import React, { PureComponent } from "react";
import { Box } from "@material-ui/core";
import CourseSearchPanel from "./CourseSearchPanel/CourseSearchPanel";
import DegreeRequirementsPanel from "./DegreeRequirementsPanel/DegreeRequirementsPanel";
import ToolPanelMenu from "./ToolPanelMenu";
import geCategoriesList from "../../json/ge_categories.json";
import departmentsList from "../../json/course_departments_list.json";
import degreesList from "../../json/degrees_list.json";
import { getRequirements } from "../../api";

const MAX_DEGREES = 10;

function ToolPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

class ToolPanels extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,

      // DegreeRequirementsPanel
      degrees: [],
      requirements: [],
      isLoading: false,

      // CourseSearchPanel
      department: departmentsList[0],
      courseNumber: "",
      geCategories: [],
    };

    this.setTab = this.setTab.bind(this);
    this.setDegrees = this.setDegrees.bind(this);
    this.getNewRequirements = this.getNewRequirements.bind(this);
    this.setListOpen = this.setListOpen.bind(this);
    this.setSectionOpen = this.setSectionOpen.bind(this);
    this.setDepartment = this.setDepartment.bind(this);
    this.setCourseNumber = this.setCourseNumber.bind(this);
    this.setGECategories = this.setGECategories.bind(this);
    this.searchQuery = this.searchQuery.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
  }
  setTab(event, newTab) {
    this.setState({ currentTab: newTab });
  }
  setDegrees(event, newDegrees) {
    if (newDegrees.length > MAX_DEGREES) {
      this.props.openAlert(`Max degrees limit: ${MAX_DEGREES}`);
      return;
    }
    this.setState({ degrees: newDegrees });
    this.getNewRequirements(newDegrees.map((degree) => degree.value));
  }
  setListOpen(degreeIndex, index, isOpen) {
    const requirements = this.state.requirements;
    let newRequirementsList = {
      ...requirements[degreeIndex].requirementsLists[index],
      open: isOpen,
    };
    let newRequirementsLists = Array.from(
      requirements[degreeIndex].requirementsLists
    );
    newRequirementsLists[index] = newRequirementsList;
    let newRequirements = Array.from(requirements);
    newRequirements[degreeIndex] = {
      ...newRequirements[degreeIndex],
      requirementsLists: newRequirementsLists,
    };
    this.setState({ requirements: newRequirements });
  }
  setSectionOpen(degreeIndex, listIndex, index, isOpen) {
    console.log(degreeIndex, listIndex, index);
    const requirements = this.state.requirements;
    let newRequirementsSection = {
      ...requirements[degreeIndex].requirementsLists[listIndex].requirements[
        index
      ],
      open: isOpen,
    };
    let newRequirements = Array.from(
      requirements[degreeIndex].requirementsLists[listIndex].requirements
    );
    newRequirements[index] = newRequirementsSection;
    let newRequirementsList = {
      ...requirements[degreeIndex].requirementsLists[listIndex],
      requirements: newRequirements,
    };
    let newRequirementsLists = Array.from(
      requirements[degreeIndex].requirementsLists
    );
    newRequirementsLists[listIndex] = newRequirementsList;
    let newDegreeRequirements = Array.from(requirements);
    newDegreeRequirements[degreeIndex] = {
      ...newDegreeRequirements[degreeIndex],
      requirementsLists: newRequirementsLists,
    };
    console.log(newDegreeRequirements);
    this.setState({ requirements: newDegreeRequirements });
  }
  async getNewRequirements(newDegrees) {
    try {
      this.startLoading(async () => {
        let jsonData = await getRequirements(newDegrees);
        console.log(jsonData);
        this.stopLoading();
        this.setState({ requirements: jsonData });
      });
    } catch (error) {
      this.props.openAlert("Get requirements failed! " + error, "error");
    }
  }
  startLoading(callback) {
    this.setState({ isLoading: true }, callback);
  }
  stopLoading() {
    this.setState({ isLoading: false });
  }
  setDepartment(event, newDepartment) {
    this.setState({ department: newDepartment });
  }
  setCourseNumber(event) {
    this.setState({ courseNumber: event.target.value });
  }
  setGECategories(event, newGECategories) {
    this.setState({ geCategories: newGECategories });
  }
  searchQuery() {
    const { department, courseNumber, geCategories } = this.state;
    if (department.value === "ALL" && geCategories.length === 0) {
      this.props.openAlert("You must specify a department or GE Categories!");
      return;
    }

    if (!courseNumber.match(/^([0-9]+[A-Za-z]* ?(- ?[0-9]+[A-Za-z]*)?)?$/g)) {
      this.props.openAlert("Course number/range invalid!");
      return;
    }
    const query = { department: department.value, courseNumber, geCategories };
    this.props.searchCourses(query);
  }
  render() {
    const {
      currentTab,
      department,
      courseNumber,
      geCategories,
      requirements,
      degrees,
      isLoading,
    } = this.state;

    return (
      <div>
        <ToolPanelMenu currentTab={currentTab} setTab={this.setTab} />
        <div
          style={{
            marginLeft: "4px",
            marginRight: "4px",
          }}
        >
          <ToolPanel value={currentTab} index={0}>
            <DegreeRequirementsPanel
              degrees={degrees}
              setDegrees={this.setDegrees}
              requirements={requirements}
              setListOpen={this.setListOpen}
              setSectionOpen={this.setSectionOpen}
              degreesList={degreesList}
              isLoading={isLoading}
            />
          </ToolPanel>
          <ToolPanel value={currentTab} index={1}>
            <CourseSearchPanel
              courseSearchList={this.props.courseSearchList}
              searchCourses={this.searchQuery}
              departmentsList={departmentsList}
              geCategoriesList={geCategoriesList}
              department={department}
              setDepartment={this.setDepartment}
              courseNumber={courseNumber}
              setCourseNumber={this.setCourseNumber}
              geCategories={geCategories}
              setGECategories={this.setGECategories}
              isLoading={this.props.isLoadingCourseSearch}
            />
          </ToolPanel>
        </div>
      </div>
    );
  }
}
export default ToolPanels;
