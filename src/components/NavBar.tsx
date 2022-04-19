// import "../assets/sass/components/_navbar.scss"
import { useState } from "react";
import userIcon from "../assets/icons/user.png";
import arrowDown from "../assets/icons/arrow_down.png";
import Hamburger from "../assets/icons/hamburger-menu.png";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);

  const toggleShowNavBar = () => setShowNavBar(!showNavBar);
  const toggleShowDropDown = () => setShowDropdown(!showDropdown);

  return (
    <div className="nav">
      <ul
        className={
          "nav__list " + (showNavBar ? "nav__list-show" : "nav__list-hide")
        }
      >
        <li className="nav__list--item">SO FUNKTIONIERT's</li>
        <li className="nav__list--item">SONDERANGEBOTE</li>
      </ul>
      <ul className="nav__list--main">
        <li className="nav__list--main-item">
          <button className="btn nav__btn" onClick={toggleShowDropDown}>
            <img src={userIcon} alt="" className="nav__btn--image" />
            MEIN BEREICH
            <img src={arrowDown} alt="" className="nav__btn--icon" />
          </button>
          <div
            className={
              "nav__dropdown " + (showDropdown ? "nav__dropdown--show" : "")
            }
          >
            <ul className={"nav__dropdown--list"}>
              <li
                className={"nav__dropdown--list-item"}
                onClick={toggleShowDropDown}
              >
                My Published Jokes
              </li>
              <li
                className={"nav__dropdown--list-item"}
                onClick={toggleShowDropDown}
              >
                My Saved Jokes
              </li>
              <li
                className={"nav__dropdown--list-item"}
                onClick={toggleShowDropDown}
              >
                Account Information
              </li>
              <li
                className={"nav__dropdown--list-item"}
                onClick={toggleShowDropDown}
              >
                Publish new joke
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div className="nav__burger" onClick={toggleShowNavBar}>
        <img src={Hamburger} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
