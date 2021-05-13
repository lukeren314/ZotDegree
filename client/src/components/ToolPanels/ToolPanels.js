import { PureComponent } from "react";
import ToolPanelMenu from "./ToolPanelMenu";
import ToolPanel from "./ToolPanel";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  toolPanelsDiv: {
    marginLeft: "4px",
    marginRight: "4px",
  },
});

class ToolPanels extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
    };
    this.setTab = this.setTab.bind(this);
  }
  setTab(_, newTab) {
    this.setState({ currentTab: newTab });
  }
  render() {
    const { currentTab } = this.state;
    const { classes, children } = this.props;
    return (
      <div>
        <ToolPanelMenu currentTab={currentTab} setTab={this.setTab} />
        <div className={classes.toolPanelsDiv}>
          {children.map((item, index) => (
            <ToolPanel
              value={currentTab}
              index={index}
              key={"toolpanel" + index}
            >
              {item}
            </ToolPanel>
          ))}
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(ToolPanels);
