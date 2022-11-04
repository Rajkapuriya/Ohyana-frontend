import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import CompanyLogo from "../../assets/img/Biguar_logo.png";
import "./index.css";
import { login } from "../../services/apiservices/login";
import { Context as AuthContext } from "../../context/authContext/authContext";
import { useNavigate } from "react-router-dom";
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';
import { Context as ContextSnackbar } from "../../context/pageContext";
import Loader from "../Loader/Loader";
import { socket } from "../../App";
const Login = () => {
  const { setAuthorize, setFlagLoader } = useContext(AuthContext);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const { errorSnackbar } = useContext(ContextSnackbar)?.state;
  const { setErrorSnackbar } = useContext(ContextSnackbar);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  // useEffect(() => {
  //   const keyDownHandler = event => {
  //     if (event.key === 'Enter') {
  //       event.preventDefault();
  //       userlogin();
  //     }
  //   };

  //   document.addEventListener('keydown', keyDownHandler);

  //   return () => {
  //     document.removeEventListener('keydown', keyDownHandler);
  //   };
  // }, []);
  const userlogin = () => {
    console.log(userDetail);
    //debugger;
    if (userDetail.email !== "" && userDetail.password !== "") {
      setFlagLoader(true)
      login(
        { email: userDetail.email, password: userDetail.password },
        (res) => {
          if (res.status === 200) {
            setAuthorize(true);
            setFlagLoader(false)
            navigate("/profile");
            socket.emit('join', { email: userDetail?.email });
            // setUserDetail({ ...userDetail, email: e.target.value });
          } else {
            if (res?.data?.error) {
              setErrorMessage(res?.data?.error?.message);
            }
          }
        },
        (resError) => {
          setErrorSnackbar({ ...errorSnackbar, status: true, message: resError.response.data.error })
          setFlagLoader(false)
        }
      );
    } else {
      setErrorSnackbar({ ...errorSnackbar, status: true, message: "Username and password are required" })
    }
  };

  return (
    <>
      <Box className="login_page_root">
        <Box className="login_page_logo_root">
          <img src={CompanyLogo} alt="Company logo" />
        </Box>
        <Box className="login_form_root">
          <Typography className="login_heading_root" variant="span">
            Welcome To BiguarTech.
          </Typography>
          <form onSubmit={(e) => {
            e.preventDefault();
            userlogin();
          }} className="w-100">
            <Box className="login_email_root">
              <Typography>Email</Typography>
              <TextField
                type="email"
                value={userDetail.email}
                variant="outlined"
                placeholder="Email"
                className="form-control"
                onChange={(e) => {
                  setUserDetail({ ...userDetail, email: e.target.value });
                }}
              />
            </Box>
            <Box className="login_password_root">
              <Typography>Password</Typography>
              <TextField
                variant="outlined"
                type="password"
                value={userDetail.password}
                onChange={(e) => {
                  setUserDetail({ ...userDetail, password: e.target.value });
                }}
                placeholder="Password"
              />
            </Box>
            <Typography className="login_forget_password_root" variant="span">
              <Button onClick={() => navigate("/forgotpassword")} > Forgotten password ? </Button>
            </Typography>
            <Box className="login_submit_button_root overflow-hidden">
              <Button type="submit" onClick={userlogin} variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
        <Typography className="login_copyright_root" variant="span">
          {new Date().getFullYear()} © Biguar Tech(India) Pvt. Ltd.
        </Typography>
      </Box>
      {/* </form> */}
      <ErrorSnackbar />
    </>
  );
};

export default Login;
