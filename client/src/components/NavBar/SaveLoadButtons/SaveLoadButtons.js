import { Fragment, PureComponent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import GetAppIcon from "@material-ui/icons/GetApp";
import RememberPasswordCheckbox from "./RememberPasswordCheckbox";
import UserKeyTextField from "./UserKeyTextField";

class SaveLoadButton extends PureComponent {
  constructor(props) {
    super(props);
    this.handleOpen = () => {
      this.setState({ open: true, showPassword: false });
    };
    this.handleClose = () => {
      this.setState({ open: false });
    };
    this.handleAction = (e) => {
      e.preventDefault();
      this.handleClose();
      this.props.doAction();
    };
    this.handleClickShowPassword = () => {
      this.setState({ showPassword: !this.state.showPassword });
    };
    this.handleClickCopyClipboard = () => {
      navigator.clipboard.writeText(this.props.userKey);
    };
    this.state = {
      open: false,
      showPassword: false,
    };
  }
  render() {
    const {
      userKey,
      setUserKey,
      rememberPassword,
      setRememberPassword,
      action,
      icon,
    } = this.props;
    const { open, showPassword } = this.state;
    return (
      <Fragment>
        <Button color="secondary" startIcon={icon} onClick={this.handleOpen}>
          {action}
        </Button>
        <Dialog open={open} onClose={this.handleClose}>
          <form onSubmit={this.handleAction}>
            <DialogTitle>{action}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter a password to {action.toLowerCase()} your data. Don't
                share this with anyone! Others using your password will edit
                your course plan.
              </DialogContentText>
              <UserKeyTextField
                userKey={userKey}
                setUserKey={setUserKey}
                showPassword={showPassword}
                handleClickShowPassword={this.handleClickShowPassword}
                handleClickCopyClipboard={this.handleClickCopyClipboard}
              />
              <RememberPasswordCheckbox
                rememberPassword={rememberPassword}
                setRememberPassword={setRememberPassword}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleAction} color="primary" type="submit">
                {action}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Fragment>
    );
  }
}

function SaveLoadButtons(props) {
  const {
    userKey,
    rememberPassword,
    setUserKey,
    setRememberPassword,
    saveUserData,
    loadUserData,
  } = props;
  return (
    <Fragment>
      <SaveLoadButton
        action={"Save"}
        icon={<SaveIcon />}
        userKey={userKey}
        setUserKey={setUserKey}
        doAction={saveUserData}
        rememberPassword={rememberPassword}
        setRememberPassword={setRememberPassword}
      />
      <SaveLoadButton
        action={"Load"}
        icon={<GetAppIcon />}
        userKey={userKey}
        setUserKey={setUserKey}
        doAction={loadUserData}
        rememberPassword={rememberPassword}
        setRememberPassword={setRememberPassword}
      />
    </Fragment>
  );
}
export default SaveLoadButtons;
