import { React, useEffect, useState, useContext } from "react";
import {
  Tabs,
  Tab,
  Box,
  FormControlLabel,
  Autocomplete,
  TextField,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button, Dialog,
  DialogActions,
  Typography, Checkbox, TablePagination
} from "@mui/material";
import "./index.css";
import { socket } from '../../App'
import DeleteIcon from '../../assets/img/delete.png'
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import { GetAdminClientDetail, DeleteClientDetail } from "../../services/apiservices/clientDetail";
import { Context as ContextSnackbar } from "../../context/pageContext";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Context as AuthContext } from "../../context/authContext/authContext";
import moment from "moment";
import Loader from "../Loader/Loader";
const Client = () => {
  // const socket = io("http://159.89.165.83", { transports: ["websocket"] });
  const [value, setValue] = useState("All");
  const navigate = useNavigate();
  const { flagLoader, permissions } = useContext(AuthContext).state;
  const { setFlagLoader } = useContext(AuthContext);
  const [clientDetails, setClientDetails] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalResult, setTotalresult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInternational, setIsInternational] = useState(null);
  const { successSnackbar } = useContext(ContextSnackbar)?.state;
  const { setSuccessSnackbar } = useContext(ContextSnackbar);
  const [timerArray, setTimerArray] = useState([]);
  const [deleteClientDialogControl, setDeleteClientDialogControl] = useState({
    status: false,
    clientId: null,
  });
  const [numbersToDisplayOnPagination, setNumbersToDisplayOnPagination] =
    useState(0)
  const [clientLoader, setClientLoader] = useState(false)
  const [clientType, setClientType] = useState([
    { stage: "intiate", id: 0 },
    { stage: "no response", id: 1 },
    {stage:"irrelevant", id: 2 },  
    { stage: "inter-mediate", id: 3 },
    { stage: "confirm", id: 4 },
  ]);
  useEffect(() => {
    console.log(clientType);
    let value = clientType.filter((data) => {
      if (data.id <= permissions?.clientStageAccess) {
        return data;
      }
    })
    setClientType(value);
    //debugger;
  }, [])
  const [clientStage, setClientStage] = useState();
  const handleClientDelete = () => {
    DeleteClientDetail(deleteClientDialogControl.clientId, (res) => {
      setDeleteClientDialogControl({ ...deleteClientDialogControl, status: false })
      setSuccessSnackbar({ ...successSnackbar, status: true, message: res.data.message })
    }, (err) => {
      //debugger
    })
  }
  const handleDialogClose = () => {
    setDeleteClientDialogControl({ ...deleteClientDialogControl, status: false })
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
  };
  const ViewClientDetail = (id) => {
    navigate(`/clientprofile/${id}`);
  };
  useEffect(() => {
    // socket.on('connect', (connection) => {
    // socket.on("client_list", (data) => {
    //     console.log("Printing Connections", data);
    //     GetAdminClientDetail(
    //       data,
    //       (res) => {
    //         if (res?.status === 200) {
    //           setClientDetails(res?.data.client);
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    //   });
    // });
    // return () => socket.disconnect();
    // const socket = io("http://159.89.165.83");
    socket.on("client_list", (data) => {
      console.log("Printing Connections", data);
      //debugger;
      GetAdminClientDetail(
        data,
        (res) => {
          if (res?.status === 200) {
            setClientDetails(res?.data.client);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    let data = { page: currentPage, size: rowsPerPage };
    if (value !== "All") {
      data["type"] = value;
    }
    if (isInternational !== null) {
      data["isInternational"] = isInternational;
    }
    data["stage"] = clientStage;
    setClientLoader(true)
    GetAdminClientDetail(
      data,
      (res) => {
        if (res?.status === 200) {
          setTotalresult(res?.data?.total);
          setClientDetails(res?.data.client);
          let pages =
            res?.data?.total > 0
              ? Math.ceil(res?.data?.total / rowsPerPage)
              : null;
          setNumbersToDisplayOnPagination(pages);
          setClientLoader(false)
          // debugger;
        }
      },
      (err) => {
        console.log(err);
        setClientLoader(false)
      }
    );
  }, [currentPage, isInternational, value, clientStage, deleteClientDialogControl.status]);
  useEffect(() => {
    let data = [...clientDetails];
    const myfunc = setInterval(displayTimer, 1000)
    function displayTimer() {
      {
        const updateData = data.map((rowData, index) => {
          var date = moment(rowData?.createdAt).add(15, 'm');
          var now = new Date(date).getTime();
          var actualTime = new Date().getTime();
          var timeleft = now - actualTime;
          if (timeleft < 0) {
            data.splice(index, 1)
            clearInterval(displayTimer)
          }
          else {
            var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
            if (seconds < 10) {
              seconds = "0" + seconds
            }
            return { ...rowData, timer: minutes + ":" + seconds }
          }
        })
        setTimerArray(updateData);
      }
    }
  }, [clientDetails])
  return (
    <>
      {clientLoader && <Loader />}
      <Box className="client_section">
        <Box className="notification_tabs_root align-items-center d-flex">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value="All" label="All" />
            <Tab value="MACHINE" label="For Machine" />
            <Tab value="PRODUCT" label="For Product" />
          </Tabs>
          <div className="d-flex">
            <FormControlLabel checked={isInternational === false ? !isInternational : null}
              onChange={(e) => {
                if (e.target.checked === true) {
                  setIsInternational(false);
                }
                else {
                  setIsInternational(null);
                }
              }} control={<Checkbox className="check_box_color" />} label="Domestic" />
            <FormControlLabel checked={isInternational === true ? isInternational : null} onChange={(e) => {
              if (e.target.checked === true) {
                setIsInternational(true);
              }
              else {
                setIsInternational(null);
              }
            }} control={<Checkbox className="check_box_color" />} label="International" />
            <Autocomplete
              className="align-items-center d-flex justify-content-center me-2"
              options={clientType}
              value={clientStage !== null ? clientType[clientStage] : null}
              sx={{ width: 200 }}
              onChange={(e, value) => {
                console.log(value);
                setClientStage(value?.id);
              }}
              getOptionLabel={(option) => option.stage}
              renderInput={(params) => (
                <TextField className="client_type_select" {...params} placeholder="Select Client Type" />
              )}
            />
            {permissions?.editClient && <Button
              className="main_button"
              onClick={() => {
                navigate("/addclient");
              }}
            >
              <AddRoundedIcon />
              New Clients
            </Button>}
          </div>
        </Box>
        <Box>
          <TableContainer sx={{ height: "70vh" }} component={Paper}>
            {clientDetails.length > 0 ?
              <Table sx={{ minWidth: 650 }}>
                <TableHead stickyHeader>
                  <TableRow>
                    <TableCell align="right">Id</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Company Name</TableCell>
                    <TableCell align="right">Contact No.</TableCell>
                    <TableCell align="right">State</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientDetails.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ minWidth: "60px", maxWidth: "60px" }}
                        className={timerArray[index]?.timer === "" ? null : "timer"
                        }
                      >
                        {row.id === timerArray[index]?.id && row?.timer_status === false ? timerArray[index]?.timer : null}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right" sx={{ maxWidth: "150px" }}>{row.business}</TableCell>
                      <TableCell align="right">{row.contact_number}</TableCell>
                      <TableCell align="right" sx={{ maxWidth: "150px" }}>{row.state}</TableCell>
                      <TableCell align="right">{moment(row.createdAt.split(" ")[0]).format('DD-MM-YYYY')}</TableCell>
                      <TableCell align="right">
                        <Button
                          className="client_view_button"
                          onClick={() => {
                            ViewClientDetail(row.id);
                          }}
                        >
                          View
                        </Button>
                        {permissions?.deleteClient && <DeleteRoundedIcon className="delete_client_icon" onClick={() => {
                          setDeleteClientDialogControl({ ...deleteClientDialogControl, status: true, clientId: row.id })
                        }} />}
                      </TableCell>
                    </TableRow>))}

                </TableBody>
              </Table> :
              <p style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", height: "100%" }}>No Data Found</p>
            }
          </TableContainer>
          <Pagination
            className="mt-3"
            boundaryCount={0}
            siblingCount={0}
            size="small"
            shape="rounded"
            count={numbersToDisplayOnPagination}
            page={currentPage}
            onChange={(e, value) => {
              setCurrentPage(value);
            }}
          />
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={3}
            count={clientDetails.length}
            rowsPerPage={numbersToDisplayOnPagination}
            page={currentPage}
            onChange={(e, value) => {
              setCurrentPage(value);
              debugger;
            }}
          /> */}
        </Box>
      </Box>
      <Dialog
        open={deleteClientDialogControl.status}
        onClose={handleDialogClose}
      >
        <Box className="client_appointment_dialog">
          <Box className="client_appointment_content">
            <img style={{ width: "60px", height: "60px" }} src={DeleteIcon} alt="" />
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Delete Client
            </Typography>
            <Typography
              sx={{ marginTop: "10px", marginBottom: "10px" }}
              variant="span"
            >
              Are You Sure you want to Delete this Client ?
            </Typography>
          </Box>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleClientDelete}
              autoFocus
            >
              Ok
            </Button>
            <Button
              className="cancel-btn"
              onClick={handleDialogClose}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );

};

export default Client;
