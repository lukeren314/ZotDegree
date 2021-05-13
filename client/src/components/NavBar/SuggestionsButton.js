import { Button } from "@material-ui/core";
import BugReportIcon from "@material-ui/icons/BugReport";
function SuggestionsButton(props) {
  return (
    <Button
      color="secondary"
      startIcon={<BugReportIcon />}
      onClick={(e) => {
        e.preventDefault();
        window.open("https://forms.gle/raXSzFLVHeV2jvV18", "_blank");
      }}
    >
      Bugs/Suggestions
    </Button>
  );
}

export default SuggestionsButton;
