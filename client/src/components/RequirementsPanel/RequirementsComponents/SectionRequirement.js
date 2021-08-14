import { Fragment } from "react";
import {
  List,
  Collapse,
  ListItemText,
  Divider,
  ListItem,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import Requirement from "./Requirement";
import { PureComponent } from "react";

class SectionRequirement extends PureComponent {
  constructor(props) {
    super(props);
    this.setIsOpen = (isOpen) => {
      this.setState({ isOpen: isOpen });
    };
    this.state = {
      isOpen: false,
    };
  }
  render() {
    const { requirement } = this.props;
    const { isOpen } = this.state;
    return (
      <Fragment>
        <Divider />
        <ListItem button onClick={() => this.setIsOpen(!isOpen)}>
          <ListItemText primary={requirement.text} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List>
            {requirement.subrequirements.map((subrequirement, index) => {
              return (
                <Requirement
                  key={requirement.text + index}
                  requirement={subrequirement}
                />
              );
            })}
          </List>
        </Collapse>
      </Fragment>
    );
  }
}

export default SectionRequirement;
