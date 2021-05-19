import { Button } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";

function DonateButton() {
  return (
    <Button
      color="secondary"
      startIcon={<FavoriteIcon />}
      onClick={(e) => {
        e.preventDefault();
        window.open(
          "https://www.paypal.com/donate?hosted_button_id=L96ATLH663V4L",
          "_blank"
        );
      }}
    >
      Donate
    </Button>
  );
}

export default DonateButton;
