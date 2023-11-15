import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  deleteEvent,
  deleteLocation,
  deleteRole,
  deleteUser,
  deletedUser,
  getAllAdminUsers,
  getAllEvents,
  getAllLocations,
  getAllRoles,
  updateUsers,
} from "src/store/slices/adminSlice";
import { toast } from "react-hot-toast";

const DeleteModal = ({ open, handleClose, id, name }) => {
  const dispatch = useDispatch();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 20,
    p: 4,

    borderRadius: 1,
  };

  const handleDelete = () => {
    const loading = toast.loading("Loading...");
    dispatch(deleteUser(id)).then((res) => {
      if (res?.payload?.success) {
        handleClose();
        dispatch(getAllAdminUsers());
        toast.dismiss(loading);
        toast.success("User deleted successfully");
      } else {
        toast.dismiss(loading);
        toast.error("An error occured while deleting the user");
      }
    });
  };

  const handleRoleDelete = () => {
    const loading = toast.loading("Loading...");
    dispatch(deleteRole(id)).then((res) => {
      if (res?.payload?.success) {
        handleClose();
        dispatch(getAllRoles());
        toast.dismiss(loading);
        toast.success("Role deleted successfully");
      } else {
        toast.dismiss(loading);
        toast.error("An error occured while deleting the role");
      }
    });
  };

  const handleLocationDelete = () => {
    const loading = toast.loading("Loading...");
    dispatch(deleteLocation(id)).then((res) => {
      if (res?.payload?.success) {
        handleClose();
        dispatch(getAllLocations());
        toast.dismiss(loading);
        toast.success("Location deleted successfully");
      } else {
        toast.dismiss(loading);
        toast.success("An error occured while deleting the location");
      }
    });
  };

  const handleEventDelete = () => {
    const loading = toast.loading("Loading...");
    dispatch(deleteEvent(id)).then((res) => {
      if (res?.payload?.success) {
        handleClose();
        dispatch(getAllEvents());
        toast.dismiss(loading);
        toast.success("Event deleted successfully");
      } else {
        toast.dismiss(loading);
        toast.error(`Error in deleting event`);
      }
    });
  };

  async function handleSubmit() {
    if (name == "user") {
      handleDelete();
    } else if (name == "role") {
      handleRoleDelete();
    } else if (name == "event") {
      handleEventDelete();
    } else {
      handleLocationDelete();
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Are You Sure?
        </Typography>
        <Typography id="modal-modal-title" fontSize={11} color="red" variant="h6" component="p">
          It will delete this document permanently.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" sx={{ mr: 1 }} onClick={() => handleSubmit()}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
