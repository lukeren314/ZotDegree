import { Fragment } from "react";
import { ListItem, ListItemText, Divider } from "@material-ui/core";

function HeaderRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      <ListItem dense={true} button>
        <ListItemText primary={requirement.comment} primaryTypographyProps={{variant: "h5"}}/>
      </ListItem>
      <Divider />
    </Fragment>
  );
}

export default HeaderRequirement;
