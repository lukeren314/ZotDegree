import { ListItem, ListItemText } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

function DegreeRequirementsHeader(props) {
  const { setListOpen, degreeIndex, index, item, degreeName } = props;
  return (
    <ListItem
      button
      onClick={() => setListOpen(degreeIndex, index, !item.open)}
    >
      <ListItemText primary={item.header} secondary={degreeName} />
      {item.open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
  );
}

export default DegreeRequirementsHeader;
