import { Checkbox, FormControlLabel } from "@material-ui/core";
function RememberPasswordCheckbox(props) {
  const { rememberPassword, setRememberPassword } = props;
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={rememberPassword}
          onChange={(event) => setRememberPassword(event.target.checked)}
          color="secondary"
        />
      }
      label="Remember Password"
    />
  );
}

export default RememberPasswordCheckbox;
