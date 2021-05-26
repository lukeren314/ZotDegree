import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import {
  loadUserDataIfNeeded,
  saveUserDataIfNeeded,
  saveRememberPassword,
  setUserKey,
} from "../../actions";
import SaveLoadButtons from "./SaveLoadButtons/SaveLoadButtons";
import AboutButton from "./AboutButton";
import ChangesSaved from "./ChangesSaved";
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
    rememberPassword,
    coursePlan,
    startYear,
    numYears,
    classes,
    dispatch,
  } = props;
  const dispatchUserKey = (userKey) => dispatch(setUserKey(userKey));
  const dispatchRememberPassword = (rememberPassword) =>
    dispatch(saveRememberPassword(rememberPassword));
  const saveUserData = () => dispatch(saveUserDataIfNeeded());
  const loadUserData = () => dispatch(loadUserDataIfNeeded());

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography color="secondary" variant="h3" className={classes.appTitle}>
          ZotDegree
        </Typography>
        <SaveLoadButtons
          userKey={userKey}
          rememberPassword={rememberPassword}
          setUserKey={dispatchUserKey}
          setRememberPassword={dispatchRememberPassword}
          saveUserData={saveUserData}
          loadUserData={loadUserData}
        />
        <SuggestionsButton />
        <AboutButton />
        <DonateButton />
        <ExportButton
          coursePlan={coursePlan}
          startYear={startYear}
          numYears={numYears}
        />
        <ChangesSaved />
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state) => ({
  ...state.userData,
  ...state.coursePlans,
});
export default connect(mapStateToProps)(withStyles(styles)(NavBar));
