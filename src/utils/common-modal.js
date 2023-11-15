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

const CommonModal = ({
  open,
  handleClose,
  handleSubmit,
  name,
  formikName,
  handleBlur,
  handleChange,
  formik,
  edit = false,
}) => {
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

    maxHeight: "70vh",

    overflow: "auto",
  };

  const fieldStyle = {
    marginTop: "20px",
    marginBottom: "20px",
  };

  const ashramStyle = {
    marginTop: "30px",
    // display: "flex",
    // flexDirection: "row",
  };

  const handleRemoveField = (indexToRemove) => {
    const newAshram = [...formik.values.ashram];
    newAshram.splice(indexToRemove, 1); // Remove the field at the specified index
    formik.setFieldValue("ashram", newAshram);
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
          Add New {name}
        </Typography>
        <Box sx={fieldStyle}>
          <TextField
            variant="filled"
            name={formikName}
            onBlur={handleBlur}
            onChange={handleChange}
            label={name + " " + "Name"}
            value={formik?.values[formikName]}
            fullWidth
          />

          {formik?.touched?.location && formik.errors.location && (
            <div style={{ fontSize: "10px", color: "red" }}>{formik.errors.location}</div>
          )}
        </Box>
        {name === "Location" && (
          <>
            <Box sx={ashramStyle}>
              {formik?.values?.ashram?.map((item, index) => (
                <>
                  <Box>
                    <TextField
                      key={index}
                      variant="filled"
                      name={`ashram[${index}].ashramName`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Ashram Name"
                      value={formik.values.ashram[index].ashramName}
                      style={{ marginBottom: "10px", marginRight: "10px" }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ height: "3.3rem" }}
                      onClick={() => handleRemoveField(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-5 h-5"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </Button>
                  </Box>
                  {formik?.touched?.ashram &&
                    formik?.touched?.ashram[index] &&
                    formik.errors.ashram &&
                    formik.errors.ashram[index] && (
                      <div style={{ fontSize: "10px", color: "red" }}>
                        {formik.errors.ashram[index].ashramName}
                      </div>
                    )}
                </>
              ))}
            </Box>
            <Button
              variant="outlined"
              color="primary"
              className="common-button-padding"
              onClick={() =>
                formik.setFieldValue("ashram", [...formik.values.ashram, { ashramName: "" }])
              }
            >
              Add Ashram
            </Button>
          </>
        )}

        <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked name="isActive" onChange={handleChange} />}
            label="Active"
          />
        </FormGroup>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button variant="contained" onClick={handleSubmit} sx={{ mr: 3 }}>
            {edit ? "Update" : "Add"}
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommonModal;
