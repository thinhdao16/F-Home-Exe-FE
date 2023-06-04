import React, { useContext, useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { images } from "../../constants";
import sidebarNav from "../../configs/sidebarNav";
import { DataContext } from "../../pages/DataContext";
import Loading from "react-fullscreen-loading";

// import { UserAuth } from '../context/AuthContext'

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const { logOut, posting, allCmt, isLiked } = useContext(DataContext);
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNav.findIndex((item) => item.section === curPath);

    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  const closeSidebar = () => {
    document.querySelector(".main__content").style.transform =
      "scale(1) translateX(0)";
    setTimeout(() => {
      document.body.classList.remove("sidebar-open");
      document.querySelector(".main__content").style = "";
    }, 500);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        navigate("/home");
      }
    }, 3000);
    setLoading(false);
    return () => clearTimeout(timer);
  }, [loading]);

  // useEffect(() => {
  //   let timeoutId = setTimeout(() => {
  //     if (
  //       posting &&
  //       allCmt &&
  //       isLiked &&
  //       posting.length > 0 &&
  //       allCmt.length > 0 &&
  //       isLiked.length > 0
  //     ) {
  //       setLoading(false);
  //       navigate("/home")
  //     }
  //   }, 3000); // Set thời gian cho setTimeout là 3 giây (3000ms)

  //   return () => {
  //     clearTimeout(timeoutId); // Xóa timeout khi component bị unmount để tránh memory leak
  //   };
  // }, [posting, allCmt, isLiked]);

  return (
    <>
      <div className="sidebar">
        {loading && <Loading loading background="#fff" loaderColor="#ff9066" />}
        <div className="sidebar__logo">
          <img src={images.logo} alt="" />
          <div className="sidebar-close" onClick={closeSidebar}>
            <i className="bx bx-x"></i>
          </div>
        </div>
        <div className="sidebar__menu">
          {sidebarNav.map((nav, index) => (
            <Link
              to={nav.link}
              key={`nav-${index}`}
              className={`sidebar__menu__item ${
                activeIndex === index && "active"
              }`}
              onClick={closeSidebar}
            >
              <div className="sidebar__menu__item__icon">{nav.icon}</div>
              <div className="sidebar__menu__item__txt">{nav.text}</div>
            </Link>
          ))}
          <div className="sidebar__menu__item">
            <div className="sidebar__menu__item__icon">
              <i className="bx bx-log-out"></i>
            </div>
            <div className="sidebar__menu__item__txt" onClick={handleSignOut}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
