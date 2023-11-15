import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { createUser, getAllLocations, getMasterRoles } from "src/store/slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";

const UserModal = ({ open, handleClose }) => {
  const [masterRoles, setMasterRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const dispatch = useDispatch();
  // const masterRoles = useSelector((state) => state?.adminSlice?.masterRoles);
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
    maxHeight: "80vh",
    overflow: "auto",
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const fieldStyle = {
    marginTop: "20px",
    marginBottom: "20px",
  };

  useEffect(() => {
    dispatch(getMasterRoles()).then((res) => {
      if (res?.payload?.success) {
        setMasterRoles(res?.payload?.Data);
      }
    });
    dispatch(getAllLocations()).then((res) => {
      console.log("locations", res?.payload?.data);
      setAllLocations(res?.payload?.data);
    });
  }, [dispatch]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: " ",
    password: "",
    role: { label: "", value: "" },
    location: { label: "", value: "" },
    isApproved: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      dispatch(createUser(values)).then((res) => {
        console.log("res", res);
        if (res.payload.success) {
          handleClose();
        }
      });
    },
  });

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRole(event.target.value);
    formik.setFieldValue("role", {
      label: value.roleName,
      value: value.id,
    });
  };

  const handleLocationChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue("location", {
      label: value ? value.location : "",
      value: value ? value.id : "",
    });
    setSelectedLocation(value);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New User
        </Typography>
        <Box sx={fieldStyle}>
          <TextField
            variant="filled"
            name="firstName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label="First Name"
            fullWidth
          />

          {formik?.touched?.firstName && formik.errors.firstName && (
            <div style={{ fontSize: "10px", color: "red" }}>{formik.errors.firstName}</div>
          )}
        </Box>
        <Box sx={fieldStyle}>
          <TextField
            variant="filled"
            name="lastName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label="Last Name"
            fullWidth
          />

          {formik?.touched?.lastName && formik.errors.lastName && (
            <div style={{ fontSize: "10px", color: "red" }}>{formik.errors.lastName}</div>
          )}
        </Box>
        <Box sx={fieldStyle}>
          <TextField
            variant="filled"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label="Email"
            fullWidth
          />

          {formik?.touched?.email && formik.errors.email && (
            <div style={{ fontSize: "10px", color: "red" }}>{formik.errors.email}</div>
          )}
        </Box>
        <Box sx={fieldStyle}>
          <TextField
            variant="filled"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label="Password"
            fullWidth
          />

          {formik?.touched?.password && formik.errors.password && (
            <div style={{ fontSize: "10px", color: "red" }}>{formik.errors.password}</div>
          )}
        </Box>
        <Box sx={fieldStyle}>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-name-label">Location</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                label="Location"
                value={selectedLocation}
                onChange={handleLocationChange}
                // input={<OutlinedInput label="Location" />}
                MenuProps={MenuProps}
              >
                {allLocations?.map((name) => (
                  <MenuItem key={name.id} value={name}>
                    {name?.location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Box>
        <Box sx={fieldStyle}>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-simple-select-label">Roles</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Roles"
                name="role"
                value={selectedRole}
                onChange={handleChange}
                input={<OutlinedInput variant="contained" label="Roles" />}
                MenuProps={MenuProps}
              >
                {masterRoles?.map((name) => (
                  <MenuItem key={name.id} value={name}>
                    {name?.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-simple-select-label">ticket_type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="ticket_type"
                value={formik.values?.ticket_type}
                onChange={formik.handleChange}
                label="ticket_type"
                onBlur={formik.handleBlur}
              >
                <MenuItem value="document">document</MenuItem>
                <MenuItem value="workflow">workflow</MenuItem>
                <MenuItem value="system">system</MenuItem>
              </Select>
              <FormHelperText>
                {formik.errors?.ticket_type &&
                  formik.touched.ticket_type &&
                  formik.errors?.ticket_type}
              </FormHelperText>
            </FormControl> */}
          </div>
        </Box>
        {/* <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked name="isActive" onChange={formik.handleChange} />}
            label="Active"
          />
        </FormGroup> */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button variant="contained" onClick={formik.handleSubmit} sx={{ mr: 3 }}>
            Add
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserModal;
