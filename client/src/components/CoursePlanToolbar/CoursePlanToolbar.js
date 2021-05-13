import { Paper, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  toolbarPaper: { marginBottom: "8px" },
  toolbarItem: { marginRight: "5vw" },
});

function CoursePlanToolbar(props) {
  const { classes, children } = props;
  return (
    <Paper className={classes.toolbarPaper}>
      <Toolbar >
        <Typography className={classes.toolbarItem}>Course Plan</Typography>
        {children.map((child, index) => (
          <div key={index} className={classes.toolbarItem}>{child}</div>
        ))}
      </Toolbar>
    </Paper>
  );
}
export default withStyles(styles)(CoursePlanToolbar);
