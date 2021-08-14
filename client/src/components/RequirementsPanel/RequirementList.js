import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import Requirement from "./RequirementsComponents/Requirement";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { PureComponent } from "react";

class RequirementList extends PureComponent {
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
    const { requirementList, parentRequirementHeader } = this.props;
    const { isOpen } = this.state;
    return (
      <Fragment>
        <ListItem button onClick={() => this.setState({isOpen:!isOpen})}>
          <ListItemText
            primary={requirementList.header}
            secondary={parentRequirementHeader}
          />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List>
            {requirementList.requirements.map((requirement, index) => {
              return (
                <Requirement
                  key={requirementList.header + index}
                  requirement={requirement}
                />
              );
            })}
          </List>
        </Collapse>
      </Fragment>
    );
  }
}

export default RequirementList;
