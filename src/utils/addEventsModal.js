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
  Grid,
  FormHelperText,
} from "@mui/material";
import DateTimePicker, { ReactDatePicker } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { styled } from "@mui/material/styles";
import { Timestamp } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { getEventById, setLoading } from "src/store/slices/adminSlice";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { app, db } from "src/contexts/firebase-context";
import { getAuth } from "firebase/auth";
import moment from "moment/moment";
import { ChromePicker } from "react-color";
import { toast } from "react-hot-toast";

const AddEventsModal = ({
  open,
  handleClose,
  handleSubmit,
  name,
  handleBlur,
  handleChange,
  formik,
  popperPlacement,
  id,
}) => {
  const [time, setTime] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date());
  const [uploaded, setUploaded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [colors, setColors] = useState(null);
  const [imgSrc, setImgSrc] = useState("https://cdn-icons-png.flaticon.com/128/1829/1829552.png");
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    boxShadow: 20,
    p: 4,
    borderRadius: 1,
  };

  const fieldStyle = {
    marginTop: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  };

  const ImgStyled = styled("img")(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(5),
    borderRadius: theme.shape.borderRadius,
  }));

  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  }));

  async function readImage(e, func) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      let binaryData = e.target.result;
      let base64String = window.btoa(binaryData);
      func(base64String);
    };

    let image = reader.readAsBinaryString(file);

    return image;
  }

  useEffect(() => {
    formik && formik.setFieldValue("date", dateTime);
  }, [dateTime]);

  useEffect(() => {
    if (id) {
      dispatch(setLoading(true));
      setIsEdit(true);
      dispatch(getEventById(id)).then((res) => {
        if (res?.payload?.Data) {
          const event = res?.payload?.Data;
          setDateTime(new Date(moment(event.date._seconds * 1000).format("LLLL")));
          var isActive = event?.isActive.toLowerCase() === "true";
          formik.setFieldValue("event", event?.event);
          formik.setFieldValue("isActive", isActive);
          formik.setFieldValue("image", event?.image);
          formik.setFieldValue("description", event?.description);
          formik.setFieldValue("event_color", event?.event_color);
        }
      });
      dispatch(setLoading(false));
    }
  }, [id, dispatch]);

  const handleCheckboxChange = (event) => {
    formik.setFieldValue("isActive", event.target.checked);
  };

  const colorPicker = (e) => {
    formik.setFieldValue("colorCode", e.hex);
    const newColor = {
      hex: e?.hex,
      rgb: "(" + e.rgb.r + "," + e.rgb.g + "," + e.rgb.b + "," + e.rgb.a + ")",
    };
    setColors(newColor);
    formik.setFieldValue("event_color", newColor.hex);
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
          {id ? `Edit ${name}` : `Add New ${name}`}
        </Typography>
        <Box sx={fieldStyle}>
          <Box>
            <TextField
              variant="filled"
              name="event"
              value={formik.values.event}
              onBlur={handleBlur}
              onChange={handleChange}
              label={name + " Name"}
              fullWidth
            />

            {formik && formik.touched.event && formik && formik.errors.event && (
              <div style={{ fontSize: "10px", color: "red" }}>{formik && formik.errors.event}</div>
            )}
            <TextField
              variant="filled"
              name="description"
              value={formik.values.description}
              onBlur={handleBlur}
              onChange={handleChange}
              style={{ marginTop: "10px" }}
              label="Description"
              multiline
              fullWidth
            />
            <TextField
              variant="filled"
              name="event_color"
              value={formik.values.event_color}
              onBlur={handleBlur}
              onChange={handleChange}
              style={{ marginTop: "10px" }}
              label="Color"
              fullWidth
            />
            <Box>
              <DateTimePicker
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                selected={dateTime}
                name="date"
                id="date-time-picker"
                dateFormat="dd/MM/yyyy HH:mm"
                popperPlacement={popperPlacement}
                onChange={(date) => {
                  setDateTime(date);
                }}
                customInput={
                  <TextField
                    fullWidth
                    style={{ width: "22rem", marginTop: "10px" }}
                    label="Date & Time"
                    name="date"
                  />
                }
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                  {imgSrc && (
                    <ImgStyled
                      loading="eager"
                      src={
                        isEdit
                          ? formik.values.image
                          : uploaded
                          ? `data:image/jpeg;base64,${imgSrc}`
                          : imgSrc
                      }
                      alt="defaultImage"
                      name="image"
                    />
                  )}

                  <div>
                    <ButtonStyled
                      component="label"
                      variant="contained"
                      htmlFor="account-settings-upload-image"
                    >
                      Upload Photo
                      <input
                        hidden
                        type="file"
                        name="image"
                        accept="image/png, image/jpeg , image/jpg"
                        onChange={(e) => {
                          formik.setFieldValue("image", e.target.files[0]);
                          readImage(e, setImgSrc);
                          setUploaded(true);
                        }}
                        id="account-settings-upload-image"
                      />
                    </ButtonStyled>
                    <Typography sx={{ color: "text.warning" }}>
                      {formik && formik.touched.image && formik && formik.errors.image ? (
                        <FormHelperText sx={{ color: "error.main" }} id="validation-basic-select">
                          {formik && formik.errors.image}
                        </FormHelperText>
                      ) : null}
                    </Typography>
                  </div>
                </Box>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Grid item xs={12} sm={4}>
              <div className="picker-container">
                <ChromePicker
                  color={colors !== null && colors?.hex}
                  onChange={(e) => colorPicker(e)}
                  disableAlpha
                  renderers={false}
                />
              </div>
            </Grid>
          </Box>
        </Box>
        <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="isActive"
                value={formik.values.isActive}
                checked={formik.values.isActive}
                onChange={(event) => handleCheckboxChange(event)}
              />
            }
            label="Active"
          />
        </FormGroup>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
              if (id) {
                setUploaded(false);
              }
            }}
            sx={{ marginRight: 3 }}
          >
            {id ? "Update" : "Add"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setIsEdit(false);
              setUploaded(false);
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEventsModal;
