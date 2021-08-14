import React, { PureComponent } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import DonateButton from "./DonateButton";

class AboutButton extends PureComponent {
  constructor(props) {
    super(props);
    this.handleOpen = () => {
      this.setState({ isOpen: true });
    };
    this.handleClose = () => {
      this.setState({ isOpen: false });
    };

    this.descriptionElementRef = React.createRef();
    this.state = {
      isOpen: false,
    };
  }
  render() {
    const { isOpen } = this.state;
    if (isOpen) {
      const { current: descriptionElement } = this.descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    return (
      <div>
        <Button
          color="secondary"
          startIcon={<HelpIcon />}
          onClick={this.handleOpen}
        >
          About
        </Button>
        <Dialog
          open={isOpen}
          onClose={this.handleClose}
          maxWidth="lg"
          scroll="body"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Welcome!</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={this.descriptionElementRef}
              tabIndex={-1}
            >
              This is ZotDegree! It's an tool for planning your coursework for
              your years at University of California - Irvine. This application
              was built by a student and IS NOT an official UCI tool. This
              program was designed for undergraduate study, so gradute programs
              may not be fully supported.
              <br />
              <br />
              To use this tool, first pick a degree using the search bar on the
              right side. Once you've picked a degree, you'll see the
              requirements to obtain that degree in the sections below. If a
              course requirement has a checkmark next to it, you can click on
              the requirement to turn it into a draggable course that you can
              add to your course plan. If you need to look for courses that are
              not listed in the requirements, use the Course Search tab.
              <br />
              <br />
              KEEP IN MIND, this tool does not guarantee that you satisfy all of
              the requirements for a degree at UCI. The requirements were
              gathered algoirthmically from the official UCI general catalogue
              page, and many of these pages were inconsistent/unclear. Double
              check with your counselor before committing to a course plan!
              <br />
              <br />
              Though I do not plan on open sourcing this project, I am open to
              pull requests. The (messy) code is publicly available at:{" "}
              <Link href="https://github.com/lukeren314/ZotDegree">
                https://github.com/lukeren314/ZotDegree
              </Link>
              <br />
              <br />
              If you would like to contribute to maintaining this tool, feel
              free to donate!
              <br />
              <DonateButton />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default AboutButton;
