import React, { PureComponent } from "react";
import { Box } from "@material-ui/core";
import CourseSearchPanel from "./CourseSearchPanel/CourseSearchPanel";
import DegreeRequirementsPanel from "./DegreeRequirementsPanel/DegreeRequirementsPanel";
import ToolPanelMenu from "./ToolPanelMenu";
import testRequirements from "../../json/test_requirements.json";
import geCategoriesList from "../../json/ge_categories.json";
import departmentsList from "../../json/course_departments_list.json";
import degreesList from "../../json/degrees_list.json";

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

      // CourseSearchPanel
      department: departmentsList[0],
      courseNumber: "",
      geCategory: "N/A",
    };

    this.setTab = this.setTab.bind(this);
    this.setDegrees = this.setDegrees.bind(this);
    this.getNewRequirements = this.getNewRequirements.bind(this);
    this.setListOpen = this.setListOpen.bind(this);
    this.setSectionOpen = this.setSectionOpen.bind(this);
    this.setDepartment = this.setDepartment.bind(this);
    this.setCourseNumber = this.setCourseNumber.bind(this);
    this.setGECategory = this.setGECategory.bind(this);
    this.searchQuery = this.searchQuery.bind(this);
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
    this.getNewRequirements(newDegrees);
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
  getNewRequirements(newDegrees) {
    let newDegreesRequirements = [testRequirements];
    for (let degreeRequirement of newDegreesRequirements) {
      for (let i = 0; i < degreeRequirement.requirementsLists.length; ++i) {
        degreeRequirement.requirementsLists[i].open = false;
        for (
          let j = 0;
          j < degreeRequirement.requirementsLists[i].requirements.length;
          ++j
        ) {
          if (
            degreeRequirement.requirementsLists[i].requirements[j].type ===
            "section"
          ) {
            degreeRequirement.requirementsLists[i].requirements[j].open = false;
          }
        }
      }
    }
    this.setState({ requirements: newDegreesRequirements });
  }
  setDepartment(event, newDepartment) {
    this.setState({ department: newDepartment });
  }
  setCourseNumber(event) {
    const newCourseNumber = event.target.value;
    if (!newCourseNumber.match(/^[0-9]+[A-Za-z]* ?(- ?[0-9]+[A-Za-z]*)?$/g)) {
      this.props.openAlert("Course number/range invalid!");
      return;
    }
    this.setState({ courseNumber: event.target.value });
  }
  setGECategory(event, newGECategory) {
    this.setState({ geCategory: newGECategory });
  }
  searchQuery() {
    const { department, courseNumber, geCategory } = this.state;
    const query = { department, courseNumber, geCategory };
    this.props.searchCourses(query);
  }
  render() {
    const {
      currentTab,
      department,
      courseNumber,
      geCategory,
      requirements,
      degrees,
    } = this.state;
    const { courseSearchList } = this.props;
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
            />
          </ToolPanel>
          <ToolPanel value={currentTab} index={1}>
            <CourseSearchPanel
              courseSearchList={courseSearchList}
              searchCourses={this.searchQuery}
              departmentsList={departmentsList}
              geCategoriesList={geCategoriesList}
              department={department}
              setDepartment={this.setDepartment}
              courseNumber={courseNumber}
              setCourseNumber={this.setCourseNumber}
              geCategory={geCategory}
              setGECategory={this.setGECategory}
            />
          </ToolPanel>
        </div>
      </div>
    );
  }
}
export default ToolPanels;
