import { TextField } from "@material-ui/core";
import EndAdornment from "./EndAdornment";

function UserKeyTextField(props) {
  const {
    showPassword,
    userKey,
    setUserKey,
    handleClickCopyClipboard,
    handleClickShowPassword,
  } = props;
  return (
    <TextField
      autoFocus
      margin="dense"
      id="userKey"
      label="Password"
      type={showPassword ? "text" : "password"}
      value={userKey}
      onChange={(event) => setUserKey(event.target.value)}
      fullWidth
      InputProps={{
        endAdornment: (
          <EndAdornment
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
            handleClickCopyClipboard={handleClickCopyClipboard}
          />
        ),
      }}
    />
  );
}

export default UserKeyTextField;
