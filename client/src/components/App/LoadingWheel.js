import { Fade, CircularProgress } from "@material-ui/core";

function LoadingWheel(props) {
  const { isLoading } = props;
  return (
    <Fade
      in={isLoading}
      style={{
        transitionDelay: isLoading ? "80ms" : "0ms",
      }}
      unmountOnExit
    >
      <CircularProgress />
    </Fade>
  );
}

export default LoadingWheel;
