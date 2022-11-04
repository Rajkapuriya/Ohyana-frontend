import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import "./index.css";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ProfileImg from "../../assets/img/profile_logo.png";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemainderTable from "./RemainderTable";
import AppointmentTable from "./AppointmentTable";
import ProfileTable from "./ProfileTable.js";
import RemainderDialog from "./RemainderDialog.js";
import StatusDialog from "./StatusDialog.js";
import AppointmentDialog from "./AppointmentDialog";
import { useNavigate } from "react-router-dom";
import ViewClientStatusDialog from "./ViewClientStatusDialog";
import { Context as AuthContext } from "../../context/authContext/authContext";
import {
  GetAdminClientProfileDetail,
  GetAdminClientStatusDetail,
  GetAdminClientReminderDetail,
  GetAdminClientAppointmentDetail,
} from "../../services/apiservices/clientDetail";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import moment from "moment";
import EditStatusDialog from "./EditStatusDialog";
import Stage0 from '../../assets/img/stage_0.svg';
import Stage1 from '../../assets/img/stage_1.svg';
import Stage2 from '../../assets/img/stage_2.svg';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import StageDialog from "./StageDialog";
const ClientProfile = () => {
  const [value, setValue] = useState("1");
  const { flagLoader, permissions } = useContext(AuthContext).state;
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [clientProfileDetail, setClientProfileDetail] = useState({});
  const [clientStatusList, setClientStatusList] = useState([]);
  const [clientReminderList, setClientReminderList] = useState([]);
  const [clientAppointmentList, setClientAppointmentList] = useState([]);
  const [stageDialog, setStageDialog] = useState(false);
  const [editStatusDialog, setEditStatusDialog] = useState({
    clientId: null,
    description: "",
    statusId: null,
    status: false
  });
  const [viewClientStatus, setViewClientStatus] = useState({
    clientId: null,
    statusDetail: {},
    status: false
  })
  let navigate = useNavigate();
  useEffect(() => {
    let path = window.location.pathname;
    console.log("Printing Path of ", path);
    console.log("Printing ", path.split("/").pop());
    path = path.split("/").pop();
    GetAdminClientProfileDetail(
      parseInt(path),
      (res) => {
        if (res.status === 200) {
          setClientProfileDetail(res?.data);
        }
      },
      (err) => {
        console.log("Printing ", err);
      }
    );
  }, [stageDialog]);
  useEffect(() => {
    let path = window.location.pathname;
    console.log("Printing Path of ", path);
    console.log("Printing ", path.split("/").pop());
    path = path.split("/").pop();
    value === "1" &&
      GetAdminClientStatusDetail(
        parseInt(path),
        (res) => {
          if (res.status === 200) {
            setClientStatusList(res?.data);
          }
        },
        (err) => {
          console.log("Printing Error", err);
        }
      );
    value === "2" &&
      GetAdminClientReminderDetail(
        parseInt(path),
        (res) => {
          if (res.status === 200) {
            setClientReminderList(res.data);
          }
        },
        (err) => {
          console.log("Printing", err);
        }
      );
    value === "3" &&
      GetAdminClientAppointmentDetail(
        parseInt(path),
        (res) => {
          if (res.status === 200) {
            setClientAppointmentList(res.data);
          }
        },
        (err) => {
          console.log("Printing", err);
        }
      );
  }, [value, statusDialog, appointmentDialog, remainderDialog]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickOpen = () => {
    setRemainderDialog(true);
  };

  const handleClose = () => {
    setRemainderDialog(false);
    setStageDialog(false)
  };
  const handleStatusOpen = () => {
    setStatusDialog(true);
  };
  const handleStatusClose = () => {
    setStatusDialog(false);
    setEditStatusDialog({
      ...editStatusDialog, status: false
    })
  };
  const handleAppointmentOpen = () => {
    setAppointmentDialog(true);
  };
  const handleAppointmentClose = () => {
    setAppointmentDialog(false);
  };
  const handleEditClientStatus = (row, clientid) => {
    setEditStatusDialog({
      ...editStatusDialog, status: true, clientId: clientid, description: row.description,
      statusId: row.id, statusDetail: row
    })
  }
  const handleViewClientStatus = (row, clientid) => {
    setViewClientStatus({ ...viewClientStatus, status: true, clientId: clientid, statusDetail: row })
  }
  const handleViewStatusDialogClose = () => {
    setViewClientStatus({ ...viewClientStatus, status: false })
  }

  return (
    <>
      <Box className="bg-body p-4 mt-4">
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Box className="userName_and_position">
              {/* <img src={ProfileImg} alt="profile" /> */}
              <AccountCircleRoundedIcon className="userprofile_dummy_icon" />
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 2 }}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: "bold", fontSize: "18px" }}
                >
                  {clientProfileDetail?.name}

                  <img className="ml-1" onClick={
                    () => {
                      setStageDialog(true)
                    }
                  } src={(clientProfileDetail?.stage === 0 && Stage0) || (clientProfileDetail?.stage === 1 && Stage1) || (clientProfileDetail?.stage === 2 && Stage2)} alt="" />
                  {(clientProfileDetail?.stage === 3 && <WarningRoundedIcon onClick={
                    () => {
                      setStageDialog(true)
                    }
                  } />)}
                </Typography>
                <Typography sx={{ marginTop: "10px" }} variant="span">
                  {clientProfileDetail?.business}
                </Typography>
              </Box>
            </Box>
            <Box>
              {/* <PrintRoundedIcon className="icon" /> */}
              {permissions?.editClient && <EditRoundedIcon
                onClick={() => {
                  navigate(`/editclient/${clientProfileDetail.id}`);
                }}
                className="icon"
              />}
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box className="tab_row">
              <TabList
                className="client_profile_tab mb-2"
                onChange={handleChange}
              >
                <Tab label="Status" value="1" />
                <Tab label="Reminder" value="2" />
                <Tab label="Appointment" value="3" />
                <Tab label="Profile" value="4" />
              </TabList>
              <Box>
                {value === "1" ? (
                  <>
                    <Button
                      onClick={handleStatusOpen}
                      className="add_status_button"
                      variant="contained"
                    >
                      <AddRoundedIcon />
                      Status
                    </Button>
                    {/* <Button className="status_close_button" variant="contained">
                      Status Close
                    </Button> */}
                  </>
                ) : null}
                {value === "2" ? (
                  <>
                    <Button
                      onClick={handleClickOpen}
                      className="add_status_button"
                      variant="contained"
                    >
                      <AddRoundedIcon />
                      Reminder
                    </Button>
                  </>
                ) : null}
                {value === "3" ? (
                  <>
                    <Button
                      className="add_status_button"
                      onClick={handleAppointmentOpen}
                      variant="contained"
                    >
                      <AddRoundedIcon />
                      Appointment
                    </Button>
                  </>
                ) : null}
              </Box>
            </Box>
            <TabPanel value="1">
              <TableContainer sx={{ height: "50vh" }} component={Paper}>
                {clientStatusList.length > 0 ? <Table stickyHeader sx={{ minWidth: 650 }}>
                  <TableHead className="client_profile_table_header">
                    <TableRow>
                      <TableCell>Sr No.</TableCell>
                      <TableCell align="left">Status Added By</TableCell>
                      {/* <TableCell align="left">Job Role</TableCell> */}
                      {/* <TableCell align="left">Audio</TableCell> */}
                      <TableCell align="left">Date</TableCell>
                      <TableCell align="left">Time</TableCell>
                      <TableCell align="left">Description</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientStatusList.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{row?.team?.name}</TableCell>
                        {/* <TableCell align="left">
                          {row?.team?.role?.name}
                        </TableCell> */}
                        {/* <TableCell align="left">
                          <audio controls controlsList="nodownload" >
                            <source src={`${process.env.REACT_APP_API_CALL_URL}/status/audio/${row?.audioUrl}`}
                              type="audio/wav">
                            </source>
                            <source src={`${process.env.REACT_APP_API_CALL_URL}/status/audio/${row?.audioUrl}`}
                              type="audio/amr">
                            </source>
                          </audio>
                        </TableCell> */}
                        <TableCell align="left">{moment(row?.date).format('LL')}</TableCell>
                        <TableCell align="left">{moment(row.time, 'hh:mm:ss').format('LT')}</TableCell>
                        <TableCell className="status_description" align="left">{row?.description}</TableCell>
                        <TableCell align="left" >
                          <Button onClick={() => {
                            handleViewClientStatus(row, clientProfileDetail.id)
                          }} className="client_profile_edit_button m-1">
                            View
                          </Button>
                          <Button
                            className="client_profile_edit_button"
                            onClick={() => {
                              handleEditClientStatus(row, clientProfileDetail.id)
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> :
                  <p style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", height: "70%", flexGrow: "auto" }}>No Data Found</p>
                }
              </TableContainer>
            </TabPanel>
            <TabPanel value="2">
              <RemainderTable clientReminderList={clientReminderList} />
            </TabPanel>
            <TabPanel value="3">
              <AppointmentTable clientAppointmentList={clientAppointmentList} />
            </TabPanel>
            <TabPanel value="4">
              <ProfileTable clientProfileDetail={clientProfileDetail} />
            </TabPanel>
          </TabContext>
          <RemainderDialog
            remainderDialog={remainderDialog}
            handleClose={handleClose}
            clientProfileDetail={clientProfileDetail}
          />
          <StatusDialog
            clientProfileDetail={clientProfileDetail}
            statusDialog={statusDialog}
            handleStatusClose={handleStatusClose}
          />
          <StageDialog
            clientProfileDetail={clientProfileDetail}
            stageDialog={stageDialog}
            handleClose={handleClose}
          />
          {editStatusDialog.status === true ? <EditStatusDialog handleStatusClose={handleStatusClose} editStatusDialog={editStatusDialog} /> : null}
          {viewClientStatus.status === true ? <ViewClientStatusDialog handleViewStatusDialogClose={handleViewStatusDialogClose} viewClientStatus={viewClientStatus} /> : null}
          <AppointmentDialog
            appointmentDialog={appointmentDialog}
            handleAppointmentClose={handleAppointmentClose}
            clientProfileDetail={clientProfileDetail}
          />
        </Box>
      </Box>
    </>
  );
};

export default ClientProfile;
