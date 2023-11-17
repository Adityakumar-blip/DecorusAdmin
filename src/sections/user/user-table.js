import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
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
  getAllAdminUsers,
  updateGroup,
  updateUser,
  updateUserAsync,
  updateUsers,
} from "src/store/slices/adminSlice";
import DeleteModal from "src/utils/delete-modal";
import { useState } from "react";

// ** icons
// import DeleteIcon from "@mui/icons-material/Delete";

export const UserTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page,
    rowsPerPage = 0,
    selected = [],
    updateRole,
  } = props;

  const [open, setOpen] = useState(false);
  const [docId, setDocId] = useState("");
  const handleOpen = (id) => {
    setOpen(true);
    setDocId(id);
  };
  const handleClose = () => setOpen(false);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteUser(id)).then((res) => {
      if (res?.payload?.success) {
        handleClose();
        dispatch(getAllAdminUsers());
      }
    });
  };

  const updateStatus = (e, userId) => {
    console.log("userId", userId);
    const updatedData = {
      isApproved: e.target.checked === true ? "admin" : "user",
    };
    dispatch(
      updateGroup({
        userId,
        updatedUserData: { role: e.target.checked === true ? "admin" : "user" },
      })
    ).then((res) => {
      if (res?.payload?.success) {
        // dispatch(updateUsers(res.payload.Data));
        // dispatch(getAllAdminUsers());
      }
    });
  };

  return (
    <>
      <DeleteModal open={open} handleClose={handleClose} name="user" id={docId} />
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Phone No.</TableCell>
                  <TableCell>Admin</TableCell>
                  {/* <TableCell>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {
                  const isSelected = selected.includes(customer?.userId);

                  return (
                    <TableRow hover key={customer?.roleId} selected={isSelected}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{customer?.fullName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{customer?.email || customer?.phoneNumber}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{customer?.role}</TableCell>
                      <TableCell>{customer?.phoneNo}</TableCell>
                      <TableCell>
                        <Switch
                          size="small"
                          checked={customer?.role === "admin" ? true : false}
                          onChange={(e) => {
                            updateRole(customer?.id, e.target.checked === true ? "admin" : "user");
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </TableCell>
                      {/* <TableCell>
                        <IconButton aria-label="delete" onClick={() => handleOpen(customer.userId)}>
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
                      </TableCell> */}
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

UserTable.propTypes = {
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
