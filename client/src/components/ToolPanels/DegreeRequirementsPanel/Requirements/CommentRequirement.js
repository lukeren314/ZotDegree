import { Fragment } from "react";
import { ListItem, ListItemText, Box, Divider } from "@material-ui/core";

function CommentRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      <ListItem>
        <ListItemText>
          <Box>{requirement.comment}</Box>
        </ListItemText>
      </ListItem>
      <Divider />
    </Fragment>
  );
}

export default CommentRequirement;
