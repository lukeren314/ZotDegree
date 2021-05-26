import { Paper, Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  toolPanelMenuPaper: {
    overflow: "hidden",
    marginBottom: "4px",
    marginRight: "4px",
    marginLeft: "4px",
  },
});
function tabProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ToolPanelMenu(props) {
  const { currentTab, setTab, classes } = props;
  return (
    <Paper color="primary" className={classes.toolPanelMenuPaper}>
      <Tabs value={currentTab} onChange={setTab} textColor="primary" centered>
        <Tab label="Degree Requirements" {...tabProps(0)} />
        <Tab label="Course Search" {...tabProps(1)} />
      </Tabs>
    </Paper>
  );
}

export default withStyles(styles)(ToolPanelMenu);
