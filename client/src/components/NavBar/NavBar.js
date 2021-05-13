import {
  AppBar,
  Box,
  CircularProgress,
  Fade,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import SaveLoadButtons from "../NavBar/SaveLoadButtons";
import AboutButton from "./AboutButton";
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
        <Box style={{ marginLeft: "5px" }}>
          {isLoadingUserDataSave ? (
            <Fade
              in={isLoadingUserDataSave}
              style={{
                transitionDelay: isLoadingUserDataSave ? "80ms" : "0ms",
              }}
              unmountOnExit
            >
              <CircularProgress color="secondary" />
            </Fade>
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
