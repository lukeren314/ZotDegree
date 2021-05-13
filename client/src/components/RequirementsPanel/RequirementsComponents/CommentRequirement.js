import { Fragment } from "react";
import { ListItem, ListItemText, Divider } from "@material-ui/core";

function CommentRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      <ListItem dense={true}>
        <ListItemText primary={requirement.comment} primaryTypographyProps={{variant:"body2"}}/>
      </ListItem>
      <Divider />
    </Fragment>
  );
}

export default CommentRequirement;
