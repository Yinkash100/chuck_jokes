import { IconButton } from "./Base/Buttons";
import ArrowRight from "../assets/icons/btn_arrow_carton_left.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__text">
        Got Jokes? Get Paid <br /> For Submitting
      </div>
      <div className="footer__button">
        <IconButton
          className={"footer__button--btn"}
          onClick={() => {}}
          text={"Submit Joke"}
          icon={ArrowRight}
          arrowButton
        />
      </div>
    </div>
  );
};

export default Footer;
