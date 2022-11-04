import React, { useContext, useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import CompanyLogo from "../../assets/img/Biguar_logo.png";
import "./index.css";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { clearLoginToken } from "../../services/storage";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App"
import { Context as AuthContext } from "../../context/authContext/authContext";
import { Context as ContextActivePage } from "../../context/pageContext";
import SuccessSnackbar from "../SuccessSnackbar/SuccessSnackbar";
import ErrorSnackbar from "../ErrorSnackbar/ErrorSnackbar";
import Loader from "../Loader/Loader";
import NotificationSnackbar from "../NotificationSnackbar/NotificationSnackbar";
import { Context as ContextSnackbar } from "../../context/pageContext";

const SideBar = () => {
  let navigate = useNavigate();
  const { authorize, flagLoader, permissions } = useContext(AuthContext).state;
  const { setPermissions } = useContext(AuthContext)
  const { setActivePage } = useContext(ContextActivePage);
  const [path, setPath] = useState(null);
  const { successSnackbar, errorSnackbar, notificationSnackbar } = useContext(ContextSnackbar)?.state;
  const { setSuccessSnackbar, setErrorSnackbar, setNotificationSnackbar } = useContext(ContextSnackbar);
  useEffect(() => {
    // socket.on("client_list", (data) => {
    //   console.log("Printing Connections", data);
    //   //debugger;
    //   GetAdminClientDetail(
    //     data,
    //     (res) => {
    //       if (res?.status === 200) {
    //         setClientDetails(res?.data.client);
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // });
    // socket.on('connect', () => {
    //   socket.on('rejoin', () => { socket.emit('join', { email: localStorage.getItem("userEmail") }); })
    //   console.log('Successfully connected to server')
    //   socket.emit('join', { email: localStorage.getItem("userEmail") });

    // })
    // socket.on("notification", function (result) {
    //   console.log(result?.data?.heading)
    //   setNotificationSnackbar({ ...notificationSnackbar, status: true, heading: result?.data?.heading, description: result?.data?.description });
    //   //debugger;
    // })
  }, [])

  useEffect(() => {
    var retrievedObject = JSON.parse(localStorage.getItem('permissions'));
    setPermissions(retrievedObject);
  }, [])
  const handleNavItemClick = (path, name) => {
    console.log("Printing Edit icon");
    navigate(path);
    setActivePage(name);
    setPath(path);
    localStorage.setItem("path", path);
  };

  useEffect(() => {
    let pathName = localStorage.getItem("path");
    setPath(pathName);

    socket.on("notification", function (result) {
      console.log(result?.data?.heading)
      setNotificationSnackbar({ ...notificationSnackbar, status: true, heading: result?.data?.heading, description: result?.data?.description });
    })
  }, []);



  return (
    <>
      <div
        // className="w-25"
        style={{ width: "20%", background: "white" }}
      // sx={{
      //   width: "15%",
      //   flexShrink: 0,
      //   "& .MuiDrawer-paper": {
      //     width: "15%",
      //     boxSizing: "border-box",
      //   },
      // }}
      // variant="permanent"
      // anchor="left"
      >
        {flagLoader ? <Loader></Loader> : null}
        <div className="main-logo ">
          <img src={CompanyLogo} alt="Company logo" />
        </div>
        <Box className="sidebar_group_icon">
          <Box
            className={`sidebar_icons ${path === "/dashboard" && "selected-link"
              }`}
            onClick={() => {
              handleNavItemClick("/dashboard", "Dashboard");
            }}
          >
            <Box className="sidebar_icon_root">
              <GridViewRoundedIcon className="sidebar_img" />
            </Box>
            <Typography className="page_name_root" variant="div">
              Dashboard
            </Typography>
          </Box>

          <Box
            to={"/notification"}
            className={`sidebar_icons ${path === "/notification" && "selected-link"
              }`}
            activeClassName="selected-link"
            onClick={() => {
              handleNavItemClick("/notification", "Notification");
              // navigate("");
              // setActivePage("Notification");
            }}
          >
            <Box className="sidebar_icon_root">
              <NotificationsRoundedIcon className="sidebar_img" />
            </Box>

            <Typography className="page_name_root" variant="div">
              Notifications
            </Typography>
          </Box>

          {permissions?.clientMenu && <Box
            className={`sidebar_icons ${path === "/client" && "selected-link"
              }`}
            onClick={() => {
              handleNavItemClick("/client", "Clients");
            }}
          >
            <Box className="sidebar_icon_root">
              <PeopleAltRoundedIcon className="sidebar_img" />
            </Box>
            <Typography className="page_name_root" variant="div">
              Clients
            </Typography>
          </Box>}

          {permissions?.staffMenu && <Box
            className={`sidebar_icons ${path === "/staff" && "selected-link"
              }`}
            onClick={() => {
              handleNavItemClick("/staff", "Staff");
              // navigate("/staff");
              // setActivePage("Staff");
            }}
          >
            <Box className="sidebar_icon_root">
              <BadgeRoundedIcon className="sidebar_img" />
            </Box>
            <Typography className="page_name_root" variant="div">
              Staff
            </Typography>
          </Box>}

          <Box
            className={`sidebar_icons ${path === "/calendar" && "selected-link"
              }`}
            onClick={() => {
              handleNavItemClick("/calendar", "Calendar");
              // navigate("/calendar");
              // setActivePage("Calendar");
            }}
          >
            <Box className="sidebar_icon_root">
              <CalendarMonthRoundedIcon className="sidebar_img" />
            </Box>
            <Typography className="page_name_root" variant="div">
              Calendar
            </Typography>
          </Box>
          {permissions?.settingMenu && <Box
            className={`sidebar_icons ${path === "/settings" && "selected-link"
              }`}
            onClick={() => {
              handleNavItemClick("/settings", "Settings");
            }}
          >
            <Box className="sidebar_icon_root">
              <SettingsIcon className="sidebar_img" />
            </Box>
            <Typography className="page_name_root" variant="div">
              Settings
            </Typography>
          </Box>}

          <Box className="sidebar_icons" onClick={clearLoginToken}>
            <Box className="sidebar_icon_root">
              <LogoutRoundedIcon className="sidebar_img" />
            </Box>
            <Typography className="page_name_root" variant="div">
              Sign Out
            </Typography>
          </Box>
        </Box>
        <SuccessSnackbar />
        <ErrorSnackbar />
        <NotificationSnackbar />
      </div>
    </>
  );
};

export default SideBar;
