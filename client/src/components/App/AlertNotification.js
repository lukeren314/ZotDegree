import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function AlertNotification(props) {
  const { alertOpen, handleClose, alertSeverity, alertMessage } = props;
  return (
    <Snackbar open={alertOpen} autoHideDuration={1500} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alertSeverity}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
}

export default AlertNotification;
