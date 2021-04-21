import React, { PureComponent } from "react";
import NavBar from "../NavBar/NavBar";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CoursePlanner from "../CoursePlanner/CoursePlanner";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0064a4",
    },
    secondary: {
      main: "#FFD200",
    },
  },
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { alertOpen: false, alertMessage: "", alertSeverity: "" };
    this.handleClose = this.handleClose.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }
  openAlert(message, severity = "info") {
    this.setState({
      alertOpen: true,
      alertMessage: message,
      alertSeverity: severity,
    });
  }
  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ alertOpen: false });
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <NavBar />

        <CoursePlanner openAlert={this.openAlert} />
        <Snackbar
          open={this.state.alertOpen}
          autoHideDuration={1500}
          onClose={this.handleClose}
        >
          <Alert onClose={this.handleClose} severity={this.state.alertSeverity}>
            {this.state.alertMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
}
export default App;
