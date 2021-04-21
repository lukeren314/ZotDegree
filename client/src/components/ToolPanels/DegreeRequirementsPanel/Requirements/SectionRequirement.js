import { Fragment } from "react";
import {
  List,
  Collapse,
  ListItemText,
  Divider,
  Box,
  ListItem,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import Requirement from "./Requirement";

function SectionRequirement(props) {
  const {
    requirement,
    setSectionOpen,
    degreeIndex,
    listIndex,
    requirementIndex,
  } = props;
  return (
    <Fragment>
      <Divider />
      <ListItem
        button
        onClick={() =>
          setSectionOpen(
            degreeIndex,
            listIndex,
            requirementIndex,
            !requirement.open
          )
        }
      >
        <ListItemText>
          <Box>{requirement.comment}</Box>
        </ListItemText>
        {requirement.open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={requirement.open} timeout="auto" unmountOnExit>
        <List>
          {requirement.courses.map((subrequirement, index) => {
            return (
              <Requirement
                key={subrequirement.comment + index}
                requirement={subrequirement}
              />
            );
          })}
        </List>
      </Collapse>
    </Fragment>
  );
}

export default SectionRequirement;
