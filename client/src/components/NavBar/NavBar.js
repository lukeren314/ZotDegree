import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import SaveLoadScheduleButtons from "./SaveLoadScheduleButtons";
import SettingsIcon from "@material-ui/icons/Settings";
import BugReportIcon from "@material-ui/icons/BugReport";
import HelpIcon from "@material-ui/icons/Help";

function NavBar() {
  return (
    <AppBar position="static" style={{ marginBottom: "4px" }}>
      <Toolbar variant="dense">
        <Typography variant="h3" style={{ paddingRight: "24px" }}>
          ZotDegree
        </Typography>

        <SaveLoadScheduleButtons />
        <Button color="inherit" startIcon={<SettingsIcon />}>
          Settings
        </Button>
        <Button color="inherit" startIcon={<BugReportIcon />}>
          Report Bugs
        </Button>
        <Button color="inherit" startIcon={<HelpIcon />}>
          Help
        </Button>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
