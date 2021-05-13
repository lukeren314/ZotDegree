import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import Requirement from "./RequirementsComponents/Requirement";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { PureComponent } from "react";

class RequirementsList extends PureComponent {
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
    const { requirementsList, requirementsName } = this.props;
    const { isOpen } = this.state;
    return (
      <Fragment>
        <ListItem button onClick={() => this.setState({isOpen:!isOpen})}>
          <ListItemText
            primary={requirementsList.header}
            secondary={requirementsName}
          />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List>
            {requirementsList.requirements.map((requirement, index) => {
              return (
                <Requirement
                  key={requirementsList.header + index}
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

export default RequirementsList;
