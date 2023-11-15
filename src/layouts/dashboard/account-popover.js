import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";

export const AccountPopover = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const userInfo = JSON.parse(localStorage.getItem("user"));
  // const { anchorEl, onClose, open } = props;
  // const router = useRouter();
  // const auth = useAuth();

  // const handleSignOut = useCallback(() => {
  //   onClose?.();
  //   auth.signOut();
  //   router.push("/auth/login");
  // }, [onClose, auth, router]);

  return (
    <></>
    // <Popover
    //   anchorEl={anchorEl}
    //   anchorOrigin={{
    //     horizontal: "left",
    //     vertical: "bottom",
    //   }}
    //   onClose={onClose}
    //   open={open}
    //   PaperProps={{ sx: { width: 200 } }}
    // >
    //   <Box
    //     sx={{
    //       py: 1.5,
    //       px: 2,
    //     }}
    //   >
    //     <Typography variant="overline">Account</Typography>
    //     <Typography color="text.secondary" variant="body2">
    //       {userInfo?.firstName} {userInfo?.lastName}
    //     </Typography>
    //   </Box>
    //   <Divider />

    // </Popover>
    // <MenuList
    //   disablePadding
    //   dense
    //   sx={{
    //     p: "8px",
    //     "& > *": {
    //       borderRadius: 1,
    //     },
    //   }}
    // >
    //   <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
    // </MenuList>
  );
};

// AccountPopover.propTypes = {
//   anchorEl: PropTypes.any,
//   onClose: PropTypes.func,
//   open: PropTypes.bool.isRequired,
// };
