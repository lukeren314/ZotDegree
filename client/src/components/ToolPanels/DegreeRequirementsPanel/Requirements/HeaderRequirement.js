import { Fragment } from "react";
import { ListItem, ListItemText, Divider, Box } from "@material-ui/core";

function HeaderRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      <ListItem button>
        <ListItemText>
          <Box fontWeight={"fontWeightBold"}>{requirement.comment}</Box>
        </ListItemText>
      </ListItem>
      <Divider />
    </Fragment>
  );
}

export default HeaderRequirement;
