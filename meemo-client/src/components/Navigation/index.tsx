import { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import NavItem from "./NavItem";
import logo from "../../img/logo.svg";
import removeLocalStorage from "../../hooks/removeLocalStorage";
import style from "./Navigation.module.scss";

function Navigation({ location: { pathname } }: any): JSX.Element {
  const userName = localStorage.getItem("meemo-user-name");

  const [media, setMedia] = useState<boolean>(false);
  const [menuColor, setMenuColor] = useState<
    {
      name: string;
      state: boolean;
      address: string;
    }[]
  >([
    { name: "Home", state: true, address: "/" },
    { name: "To-Do List", state: false, address: "/todo" },
    { name: "Schedule", state: false, address: "/schedule" },
    { name: "Folders", state: false, address: "/folders" },
    { name: "Calendar", state: false, address: "/calendar" },
  ]);

  const handleNavColor = (address: string) => {
    setMenuColor(
      menuColor.map((elem) =>
        elem.address.substring(0, 5) === address.substring(0, 5)
          ? { ...elem, state: true }
          : { ...elem, state: false }
      )
    );
  };

  const onClickLogout = () => {
    axios
      .get("/api/users/logout")
      .then((res) => {
        if (res.data.success) {
          removeLocalStorage();
        } else {
          alert("failed");
        }
      })
      .then(() => (document.location.href = "/auth"));
  };

  const onClickBurger = () => {
    media ? setMedia(false) : setMedia(true);
  };

  useEffect(() => {
    handleNavColor(pathname);
  }, [pathname]);

  return (
    <div
      className={pathname === "/auth" ? style.nav_hidden : style.nav_wrapper}
    >
      <nav className={style.nav_inside}>
        <div
          className={media ? style.burger_toggle : style.burger_menu}
          onClick={onClickBurger}
        >
          <div className={style.burger_line1}></div>
          <div className={style.burger_line2}></div>
          <div className={style.burger_line3}></div>
        </div>

        <Link to="/">
          <img
            className={style.logo}
            src={`${logo}`}
            alt="logo"
            onClick={() => handleNavColor("/")}
          />
        </Link>

        <div className={media ? style.nav_items_on : style.nav_items_off}>
          <div className={style.nav_menus}>
            {menuColor.map((data) => (
              <NavItem
                data={data}
                handleNavColor={handleNavColor}
                key={data.address}
                offNav={() => setMedia(false)}
              />
            ))}
          </div>
        </div>

        <div className={style.user_menu}>
          <p className={style.nav_username}>{userName}님</p>
          <button className={style.logout_btn} onClick={onClickLogout}>
            로그아웃
          </button>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);
