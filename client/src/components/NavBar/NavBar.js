import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LoadingWheel from "../App/LoadingWheel";
import SaveLoadButtons from "../NavBar/SaveLoadButtons";
import AboutButton from "./AboutButton";
import DonateButton from "./DonateButton";
import ExportButton from "./ExportButton";
import SuggestionsButton from "./SuggestionsButton";

const styles = () => ({
  appBar: { marginBottom: "4px" },
  appTitle: { paddingRight: "24px", paddingBottom: "4px" },
});

function NavBar(props) {
  const {
    userKey,
    setUserKey,
    rememberPassword,
    setRememberPassword,
    saveUserData,
    loadUserData,
    isLoadingUserDataSave,
    changesSaved,
    courses,
    startYear,
    numYears,
    classes,
  } = props;
  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography color="secondary" variant="h3" className={classes.appTitle}>
          ZotDegree
        </Typography>
        <SaveLoadButtons
          userKey={userKey}
          setUserKey={setUserKey}
          rememberPassword={rememberPassword}
          setRememberPassword={setRememberPassword}
          saveUserData={saveUserData}
          loadUserData={loadUserData}
        />
        <SuggestionsButton />
        <AboutButton />
        <DonateButton />
        <ExportButton courses={courses} startYear={startYear} numYears={numYears}/>
        <Box style={{ marginLeft: "5px" }}>
          {isLoadingUserDataSave ? (
            <LoadingWheel isLoading={isLoadingUserDataSave} />
          ) : (
            <Typography color="secondary" variant="caption">
              {changesSaved ? "Changes Saved" : "*Unsaved changes"}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default withStyles(styles)(NavBar);
