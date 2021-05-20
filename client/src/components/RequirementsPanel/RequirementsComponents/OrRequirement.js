import { Fragment } from "react";
import { ListItem, ListItemText, Divider } from "@material-ui/core";
import Requirement from "./Requirement";

function OrRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      {requirement.subrequirements.map((subrequirement, index) => {
        return (
          <Fragment key={subrequirement.course + "or" + index}>
            <Requirement requirement={subrequirement} />
            {index !== requirement.subrequirements.length - 1 && (
              <ListItem dense={true}>
                <ListItemText primary="or"/>
              </ListItem>
            )}
          </Fragment>
        );
      })}
      <Divider />
    </Fragment>
  );
}

export default OrRequirement;
