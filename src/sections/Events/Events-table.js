import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { useDispatch } from "react-redux";
import {
  deleteEvent,
  deleteLocation,
  getAllEvents,
  getAllLocations,
  updateLocation,
  updateLocations,
} from "src/store/slices/adminSlice";
import DeleteModal from "src/utils/delete-modal";
import { useState } from "react";
import { Timestamp } from "firebase/firestore/lite";
import AddEventsModal from "src/utils/addEventsModal";

export const EventsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    onData,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const [open, setOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [docId, setDocId] = useState("");
  const handleOpen = (id) => {
    setOpen(true);
    setDocId(id);
  };

  const handleEventEdit = (eventId) => {
    onData(eventId);
  };
  const handleClose = () => setOpen(false);
  const handleEventClose = () => setEventOpen(false);

  const dispatch = useDispatch();

  const updateStatus = (e, customer) => {
    const updatedData = {
      id: customer.id,
      isActive: e.target.checked,
    };
    dispatch(updateLocation(updatedData)).then((res) => {
      if (res?.payload?.success) {
        dispatch(updateLocations(res?.payload?.Data));
        dispatch(getAllLocations());
      }
    });
  };

  function formatDateAndTime(timeStamp) {
    const jsDate = new Date(timeStamp._seconds * 1000 + timeStamp._nanoseconds / 1000000);
    const day = String(jsDate.getDate()).padStart(2, "0");
    const month = String(jsDate.getMonth() + 1).padStart(2, "0");
    const year = String(jsDate.getFullYear()).slice(-2);

    const hours = String(jsDate.getHours()).padStart(2, "0");
    const minutes = String(jsDate.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return (
    <>
      <DeleteModal open={open} handleClose={handleClose} name="event" id={docId} />
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {
                  const isSelected = selected.includes(customer.id);
                  return (
                    <TableRow hover key={customer.id} selected={isSelected}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          {/* <Avatar src={customer.avatar}>{getInitials(customer.location)}</Avatar> */}
                          <Typography variant="subtitle2">{customer.event}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">
                            {formatDateAndTime(customer.date)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={customer.isActive == "false" ? false : true}
                          onChange={(e) => {
                            updateStatus(e, customer);
                          }}
                          size="small"
                          inputProps={{ "aria-label": "controlled", readOnly: true }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEventEdit(customer?.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                            width="24"
                          >
                            <path
                              d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"
                              fill="#35A6B1"
                            />
                            <path
                              d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"
                              fill="#35A6B1"
                            />
                          </svg>
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => handleOpen(customer.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                              fill="#ee5757"
                            />
                          </svg>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

EventsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
