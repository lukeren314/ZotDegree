import { Box } from "@material-ui/core";

function ToolPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {<Box>{children}</Box>}
    </div>
  );
}

export default ToolPanel;
