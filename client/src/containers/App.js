import { PureComponent } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import NavBar from "../components/NavBar/NavBar";
import CoursePlanner from "../components/CoursePlanner/CoursePlanner";
import AlertNotification from "../components/App/AlertNotification";
import { closeAlert, loadPassword } from "../actions";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0064A4",
    },
    secondary: {
      main: "#FFD200",
    },
  },
});

class App extends PureComponent {
  constructor(props) {
    super(props);

    // ALERTS -----------------------------------------------------------------
    this.handleClose = (reason) => {
      if (reason === "clickaway") return;
      this.props.dispatch(closeAlert());
    };

    // USER DATA --------------------------------------------------------------
    this.beforeUnload = (e) => {
      if (!this.props.changesSaved) {
        e.preventDefault();
        e.returnValue = true;
      }
    };
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeUnload);
    this.props.dispatch(loadPassword());
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeUnload);
  }
  render() {
    const { open, severity, message } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <NavBar />
        <CoursePlanner />
        <AlertNotification
          alertOpen={open}
          handleClose={this.handleClose}
          alertSeverity={severity}
          alertMessage={message}
        />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.alerts,
  changesSaved: state.userData.changesSaved,
});

export default connect(mapStateToProps)(App);
