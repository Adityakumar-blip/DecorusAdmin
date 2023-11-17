import {
  Box,
  Button,
  FormControl,
  Modal,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { createMessage } from "src/store/slices/adminSlice";

const MessageModal = ({ open, handleclose }) => {
  const [isText, setIsText] = useState(false);
  const [isGif, setIsGif] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
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
    maxHeight: "70vh",
    overflow: "auto",
  };

  const buttonStyle = {
    display: "flex",

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

  const formik = useFormik({
    initialValues: isText ? { gif: null } : { message: "" },
    onSubmit: (values) => {
      const data = new FormData();
      data.append("message", !isText ? values["gif"] : values["message"]);

      dispatch(createMessage(data)).then((res) => {
        console.log("response", res);
      });
      console.log("values", values);
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleclose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" style={{ marginBottom: "1rem" }}>
          Choose your message type
        </Typography>
        <Box
          sx={{
            border: "1px solid black",
            padding: "1rem",
            borderRadius: "10px",
            maxHeight: "70vh",
          }}
        >
          <Box sx={buttonStyle}>
            <Button
              variant={isText ? "contained" : "outlined"}
              onClick={() => {
                setIsText(true);
              }}
            >
              Text
            </Button>
            <Button
              variant={!isText ? "contained" : "outlined"}
              onClick={() => {
                setIsText(false);
              }}
            >
              Sticker
            </Button>
          </Box>
          <Box sx={{ marginTop: "1rem" }}>
            {isText ? (
              <Box>
                <TextField
                  placeholder="Enter your Message"
                  name="message"
                  label="message"
                  onChange={formik.handleChange}
                  value={formik.values.message}
                />
              </Box>
            ) : (
              <Box>
                <FormControl fullWidth>
                  <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                    {imgSrc && (
                      <ImgStyled
                        loading="eager"
                        src={`data:image/jpeg;base64,${imgSrc}`}
                        alt="uploadedGif"
                        name="image"
                      />
                    )}

                    <div>
                      <Button
                        component="label"
                        variant="contained"
                        htmlFor="account-settings-upload-image"
                      >
                        Upload sticker
                        <input
                          hidden
                          type="file"
                          name="customMessage"
                          accept="image/gif , image/jpg , image/png , image/jpeg"
                          onChange={(e) => {
                            formik.setFieldValue("gif", e.target.files[0]);
                            // setImgSrc(e.target.files[0]);
                            readImage(e, setImgSrc);
                          }}
                          id="account-settings-upload-image"
                        />
                      </Button>
                      <Typography sx={{ color: "text.warning" }}>
                        {formik && formik.touched.image && formik.errors.image ? (
                          <FormHelperText sx={{ color: "error.main" }} id="validation-basic-select">
                            {formik && formik.errors.image}
                          </FormHelperText>
                        ) : null}
                      </Typography>
                    </div>
                  </Box>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={() => {
              formik.handleSubmit();
            }}
            sx={{ marginRight: 3 }}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              handleclose();
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MessageModal;
