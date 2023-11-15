import { Box, Button, FormControl, Modal, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { createMessage } from "src/store/slices/adminSlice";

const MembersModal = ({ open, handleclose, members }) => {
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

  return (
    <Modal
      open={open}
      onClose={handleclose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
          <Typography style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "10px" }}>
            {members?.groupName} Members
          </Typography>
          {members?.members?.map((item, index) => (
            <Box
              sx={{
                borderBottom: "1px solid grey",
                padding: "1rem",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
              key={index}
            >
              <Box>
                <img src={item?.image} height={50} width={50} style={{ borderRadius: "50px" }} />
              </Box>
              <Typography style={{ fontSize: "1rem", color: "black", fontWeight: "600" }}>
                {item?.firstName + " " + item?.lastName}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
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

export default MembersModal;
