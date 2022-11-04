import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Divider, Button, Grid } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import "./index.css";
import JobRoleDialog from "./JobRoleDialog";
import DeleteJobRoleDialog from "./DeleteJobRoleDialog";
import DeleteDepartmentDialog from "./DeleteDepartmentDialog";
import AddEditDepartmentDialog from "./AddEditDepartmentDialog";
import { GetAdminRole } from "../../services/apiservices/adminprofile";
import SuccessSnackbar from "../SuccessSnackbar/SuccessSnackbar";
import EditJobRoleDialog from "./EditJobRoleDialog";
import { Context as AuthContext } from "../../context/authContext/authContext";

const Department = () => {
  const { flagLoader, permissions } = useContext(AuthContext).state;

  const [jobRoleDialogControl, setJobRoleDialogControl] = useState(false);
  const [deleteJobRoleDialogControl, setDeleteJobRoleDialogControl] =
    useState({ status: false, id: null });
  const [deleteDepartmentDialogControl, setDeleteDepartmentControl] =
    useState({
      status: false,
      id: null,
    });
  const [editJobRoleDialogControl, setEditJobRoleDialogControl] = useState({
    status: false,
    departmentId: null,
    name: "",
    description: "", roleId: null
  })
  const [addEditDepartmentDialogControl, setAddEditDepartmentDialogControl] =
    useState({
      status: false,
      id: null,
      departmentName: "",
    });
  const [jobRoleList, setJobRoleList] = useState({
    name: "",
    roles: [],
    departmentId: null,
  });
  const handleClose = () => {
    setJobRoleDialogControl(false);
    setDeleteJobRoleDialogControl({ ...deleteJobRoleDialogControl, status: false });
    setDeleteDepartmentControl({ ...deleteDepartmentDialogControl, status: false });
    setAddEditDepartmentDialogControl(false);
    setEditJobRoleDialogControl({ ...editJobRoleDialogControl, status: false });
  };
  useEffect(() => {
    let path = window.location.pathname;
    console.log("Printing Path of ", path);
    console.log("Printing ", path.split("/").pop());
    path = path.split("/").pop();
    GetAdminRole(
      parseInt(path),
      (res) => {
        if (res.status === 200) {
          setJobRoleList({
            ...jobRoleList,
            departmentId: res.data.department.id,
            name: res.data.department.name,
            roles: res.data.roles,
          });
        }
      },
      (err) => {
        console.log(err);
        //
      }
    );
  }, [deleteJobRoleDialogControl.status, jobRoleDialogControl, editJobRoleDialogControl.status]);

  return (
    <>
      <Box className="Sales_section mt-3">
        <Box className="sales_header_section">
          <Typography variant="h5">{jobRoleList.name}</Typography>
          <Box>
            {permissions?.editDepartment && <EditRoundedIcon
              onClick={() => {
                setAddEditDepartmentDialogControl({ ...addEditDepartmentDialogControl, id: jobRoleList.departmentId, status: true, departmentName: jobRoleList.name });
              }}
              className="edit_icon_profile"
            />}
            {permissions?.deleteDepartment && < DeleteRoundedIcon
              onClick={() => {
                setDeleteDepartmentControl({ ...deleteDepartmentDialogControl, status: true, id: jobRoleList.departmentId });
              }}
              className="edit_icon_profile"
            />}
          </Box>
        </Box>
        <Divider sx={{ width: "95%", margin: "0 auto" }} />
        <div className="bg-body p-4">
          <Box className="job_role_title mb-3">
            <Typography variant="span" className="ms-2">
              Job Roles
            </Typography>
            {permissions?.editDepartment && <Button
              onClick={() => {
                setJobRoleDialogControl(true);
              }}
              variant="contained"
            >
              + Add Job Role
            </Button>}
          </Box>
          {jobRoleList.roles.length > 0 &&
            jobRoleList?.roles.map((data, index) => {
              return (
                <Box className="appointment_notification">
                  <Grid
                    container
                    spacing={2}
                    className="align-items-center d-flex justify-content-center"
                  >
                    <Grid item xs={2}>
                      <Typography variant="span">{index + 1}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="span">{data.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="span">{data.description}</Typography>
                    </Grid>
                    <Grid item spacing={2}>
                      {permissions?.editDepartment && <EditRoundedIcon
                        onClick={() => {
                          setEditJobRoleDialogControl({
                            ...editJobRoleDialogControl, status: true,
                            departmentId: jobRoleList.departmentId,
                            name: data.name,
                            description: data.description, roleId: data.id
                          })
                        }}
                        className="edit_icon_profile" />}
                      {/* <Button className="btn-outlined">Edit</Button> */}
                      {/* <Button
                        className="btn-outlined"
                        onClick={() => {
                          setDeleteJobRoleDialogControl(true);
                        }}
                      >
                        Delete
                      </Button> */}
                      {permissions?.editDepartment && <DeleteRoundedIcon
                        onClick={() => {
                          setDeleteJobRoleDialogControl({ ...deleteJobRoleDialogControl, status: true, id: data.id });
                        }}
                        className="edit_icon_profile"
                      />}
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
        </div>
        <JobRoleDialog
          jobRoleList={jobRoleList}
          jobRoleDialogControl={jobRoleDialogControl}
          handleClose={handleClose}
        />
        {editJobRoleDialogControl.status === true && <EditJobRoleDialog
          editJobRoleDialogControl={editJobRoleDialogControl}
          handleClose={handleClose}
        />}
        <DeleteJobRoleDialog
          deleteJobRoleDialogControl={deleteJobRoleDialogControl}
          handleClose={handleClose}
        />
        <DeleteDepartmentDialog
          deleteDepartmentDialogControl={deleteDepartmentDialogControl}
          handleClose={handleClose}
        />
        {addEditDepartmentDialogControl.status === true && < AddEditDepartmentDialog
          addEditDepartmentDialogControl={addEditDepartmentDialogControl}
          handleClose={handleClose}
        />
        }
      </Box>
    </>
  );
};

export default Department;
