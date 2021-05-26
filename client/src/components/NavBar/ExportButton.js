import { Button, List, Popover } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { PureComponent } from "react";
import { CSVLink } from "react-csv";

const getQuarterNum = (quarterStr) => {
  if (quarterStr === "Fall") return 0;
  if (quarterStr === "Winter") return 1;
  if (quarterStr === "Spring") return 2;
  if (quarterStr === "Summer") return 3;
  return -1;
};

const createCSVContent = (courses, startYear, numYears) => {
  let nestedCourses = [...Array(numYears).keys()].map(() => [[], [], [], []]);
  for (let course of courses) {
    let quarter = getQuarterNum(course.quarter);
    if (quarter < 0) {
      continue;
    }
    nestedCourses[course.year][quarter].push(course.content.id);
  }

  let csvContent = [];
  for (let year = 0; year < numYears; ++year) {
    csvContent.push([
      `${startYear + year}-${startYear + year + 1}`,
      "Fall",
      "Winter",
      "Spring",
      "Summer",
    ]);
    let maxCourses = Math.max(
      ...nestedCourses[year].map((quarterPlan) => quarterPlan.length)
    );
    for (let i = 0; i < maxCourses; ++i) {
      csvContent.push([
        "",
        ...nestedCourses[year].map((quarterPlan) =>
          i < quarterPlan.length ? quarterPlan[i] : ""
        ),
      ]);
    }
    csvContent.push(["", "", "", "", ""]);
  }
  return csvContent;
};

class ExportButton extends PureComponent {
  constructor(props) {
    super(props);
    this.handleOpen = (event) => {
      this.setState({ anchorEl: event.currentTarget });
    };
    this.handleClose = () => {
      this.setState({ anchorEl: null });
    };
    this.state = {
      anchorEl: null,
    };
  }
  render() {
    const { coursePlan, startYear, numYears } = this.props;
    const { anchorEl } = this.state;
    const csvData = createCSVContent(coursePlan, startYear, numYears);
    return (
      <div>
        <Button
          color="secondary"
          startIcon={<ArrowUpwardIcon />}
          onClick={this.handleOpen}
        >
          Export
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List>
            <Button>
              <CSVLink data={csvData} filename="courseplan.csv">
                .csv
              </CSVLink>
            </Button>
          </List>
        </Popover>
      </div>
    );
  }
}

export default ExportButton;
