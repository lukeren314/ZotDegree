import { Droppable } from "react-beautiful-dnd";
import CourseDroppableBase from "./CourseDroppableBase";
import CourseDroppableTable from "./CourseDroppableTable";
import {withStyles} from "@material-ui/styles";

const grid = 4;

const styles = () => ({
  root: { maxWidth: "100%" },
});

const getListStyle = (isDraggingOver, backgroundColor) => {
  return {
    background: isDraggingOver ? "lightblue" : backgroundColor,
    padding: grid,
  };
};

function CourseDroppable(props) {
  const {
    droppableId,
    courses,
    backgroundColor,
    isDeletable,
    itemWidth,
    tableForm,
    deleteAction,
    classes,
  } = props;
  const DroppableComponent = tableForm
    ? CourseDroppableTable
    : CourseDroppableBase;
  return (
    <Droppable droppableId={droppableId} className={classes.root}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver, backgroundColor)}
        >
          <DroppableComponent
            courses={courses}
            isDeletable={isDeletable}
            itemWidth={itemWidth}
            deleteAction={deleteAction}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default withStyles(styles)(CourseDroppable);
