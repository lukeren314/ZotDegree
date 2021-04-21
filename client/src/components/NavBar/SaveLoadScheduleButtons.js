import { Fragment } from "react";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import GetAppIcon from "@material-ui/icons/GetApp";

function SaveLoadScheduleButtons() {
  return (
    <Fragment>
      <Button color="inherit" startIcon={<SaveIcon />}>
        Save
      </Button>
      <Button color="inherit" startIcon={<GetAppIcon />}>
        Load
      </Button>
    </Fragment>
  );
}
export default SaveLoadScheduleButtons;
