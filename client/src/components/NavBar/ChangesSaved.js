import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import LoadingWheel from "../App/LoadingWheel";

function ChangesSaved(props) {
  const { isFetchingSave, changesSaved } = props;
  return (
    <Box style={{ marginLeft: "5px" }}>
      {isFetchingSave ? (
        <LoadingWheel isLoading={isFetchingSave} />
      ) : (
        <Typography color="secondary" variant="caption">
          {changesSaved ? "Changes Saved" : "*Unsaved changes"}
        </Typography>
      )}
    </Box>
  );
}
const mapStateToProps = (state) => state.userData;
export default connect(mapStateToProps)(ChangesSaved);
