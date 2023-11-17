import { Box, Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useAuth } from "src/hooks/use-auth";

const SignoutModal = ({ open, handleClose }) => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  const auth = useAuth();

  const handleSignOut = useCallback(() => {
    handleClose();
    auth.signOut();
    router.push("/auth/login");
  }, [auth, router]);

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
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h6"
            style={{ color: "#ee5757" }}
          >
            Are you sure youre ready to sign out?
          </Typography>
          {/* <Typography id="modal-modal-title" fontSize={11} color="red" variant="h6" component="p">
            It will delete this document permanently.
          </Typography> */}
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" sx={{ mr: 1 }} onClick={() => handleSignOut()}>
              Signout
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SignoutModal;
