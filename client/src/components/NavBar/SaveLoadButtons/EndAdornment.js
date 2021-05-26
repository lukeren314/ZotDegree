import { InputAdornment, IconButton, Tooltip } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AssignmentIcon from "@material-ui/icons/Assignment";

function EndAdornment(props) {
  const { showPassword, handleClickCopyClipboard, handleClickShowPassword } =
    props;
  return (
    <InputAdornment position="end">
      <Tooltip title="Copy to clipboard">
        <IconButton
          size="small"
          aria-label="toggle password visibility"
          onClick={handleClickCopyClipboard}
        >
          <AssignmentIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={(showPassword ? "Hide" : "Show") + " Password"}>
        <IconButton
          size="small"
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
}

export default EndAdornment;
