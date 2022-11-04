import React,{useContext} from "react";
import { Box, Typography } from "@mui/material";
import "./index.css";
import DepartmentIcon from "../../assets/img/department_icon.svg";
import ProductIcon from "../../assets/img/Product.svg";
import { useNavigate } from "react-router-dom";
import { Context as AuthContext } from "../../context/authContext/authContext";

const Settings = () => {
  const { flagLoader, permissions } = useContext(AuthContext).state;

  const navigate = useNavigate();
  return (
    <>
      <Box className="product_list_section mt-4">
        {  permissions?.viewDepartment && <Box
          className="setting_cards-list"
          onClick={() => {
            navigate("/departmentlist");
          }}
        >
          <img
            className="department_icon"
            src={DepartmentIcon}
            alt="department_icon"
          />
          <Typography variant="span">Department</Typography>
        </Box>}
        {  permissions?.viewProduct
          && <Box
            className="setting_cards-list"
            onClick={() => {
              navigate("/productlist");
            }}
          >
            <img
              className="department_icon"
              src={ProductIcon}
              alt="ProductIcon"
            />
            <Typography variant="span">Product</Typography>
          </Box>}
      </Box>
    </>
  );
};

export default Settings;
