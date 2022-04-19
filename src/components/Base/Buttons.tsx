interface ButtonI {
  className: string;
  isDisabled?: boolean;
  onClick: () => void;
  text: string;
}

interface IconButtonI {
  arrowButton?: boolean;
  className: string;
  isDisabled?: boolean;
  onClick: () => void;
  text: string;
  icon: string;
}

const Button = ({ className, text, onClick, isDisabled }: ButtonI) => {
  return (
    <button className={className} onClick={onClick} disabled={isDisabled}>
      {text}
    </button>
  );
};

const IconButton = ({
  arrowButton,
  text,
  onClick,
  className,
  isDisabled,
  icon,
}: IconButtonI) => {
  return (
    <button
      className={"icon-button " + className}
      onClick={onClick}
      disabled={isDisabled}
    >
      <span className={"icon-button__text"}>{text}</span>
      <img
        src={icon}
        alt=""
        className={
          "icon-button__icon " +
          (arrowButton ? "icon-button__icon-animate" : "")
        }
      />
    </button>
  );
};

const IconButtonAlt = ({
                      arrowButton,
                      text,
                      onClick,
                      className,
                      isDisabled,
                      icon,
                    }: IconButtonI) => {
  return (
      <button
          className={"icon-button " + className}
          onClick={onClick}
          disabled={isDisabled}
      >
        <img
            src={icon}
            alt=""
            className={
              "icon-button__icon icon-button__icon--alt " +
              (arrowButton ? "icon-button__icon-animate-alt" : "")
            }
        />
        <span className={"icon-button__text"}>{text}</span>

      </button>
  );
};

export default Button;
export { IconButton, IconButtonAlt };
