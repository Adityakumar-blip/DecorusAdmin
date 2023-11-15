import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addEvent,
  deleteAllMessages,
  deleteSingleMessage,
  getAllEvents,
  getAllMessages,
  updateEvent,
} from "src/store/slices/adminSlice";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import useCustomers from "src/utils/use-customers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import AddEventsModal from "src/utils/addEventsModal";
import { useFormik } from "formik";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventsTable } from "src/sections/Events/Events-table";

import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import MessageModal from "src/utils/messages-modal";
import { SuggestionTable } from "src/sections/suggestions/suggestion-table";
import { ChatsTable } from "src/sections/chats/chats-table";
import { isURL } from "src/utils/Functions";
import MembersModal from "src/utils/members.modal";

const initialValues = {
  message: "",
};

const Page = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [eventId, setEventId] = useState("");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
  const handleOpen = (messages) => {
    setMessages(messages);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      setEventId("");
    }
  };

  const Data = useSelector((state) => state.AdminSlice?.roomMessages);

  const customers = useCustomers(page, rowsPerPage, Data);

  //   useEffect(() => {
  //     dispatch(getAllMessages());
  //   }, [dispatch]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const filteredData = Data?.messages?.filter((role) =>
    role?.roleName?.toLowerCase().includes(searchValue?.toLowerCase())
  );

  const handleFilter = useCallback((val) => {
    setSearchValue(val);
  }, []);

  const handleDeleteAllMessages = () => {
    const deleteRoom = {
      room: Data?.id,
      type: Data?.type,
    };
    dispatch(deleteAllMessages(deleteRoom));
  };

  const handleDeleteMessageById = (messageId) => {
    const messageObj = {
      type: Data?.type,
      roomId: Data?.id,
      messageId,
    };
    dispatch(deleteSingleMessage(messageObj));
  };
  return (
    <>
      <Head>
        <title>Chats | Decorus</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* <h2>Chat Screen</h2> */}
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Chat Screen</Typography>
              </Stack>
              <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                <Button variant="contained" onClick={() => handleDeleteAllMessages()}>
                  Delete All Message
                </Button>
                <Button
                  //   startIcon={
                  //     <SvgIcon fontSize="small">
                  //       <PlusIcon />
                  //     </SvgIcon>
                  //   }
                  variant="contained"
                  onClick={() => handleOpen(true)}
                >
                  Members
                </Button>
              </div>
            </Stack>
            {/* <Card sx={{ p: 2 }}>
              <OutlinedInput
                fullWidth
                placeholder="Search Chats"
                value={searchValue}
                onChange={(e) => handleFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 500 }}
              />
            </Card>
            <ChatsTable /> */}
            <Card
              sx={{
                height: "80vh", // Set a fixed height
                padding: "2rem",
                overflowY: "scroll", // Add scroll for overflow
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {Data?.messages?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignSelf: "flex-start",
                      backgroundColor: "#1C2536",
                      padding: item?.mediaType === "image" ? " 10px 3px 3px 3px" : "10px",
                      borderRadius: "10px",
                      width: "max-content",
                      flexDirection: "column",
                      gap: "5px",
                      position: "relative",
                    }}
                  >
                    <div className="box-container">
                      <div className="delete-icon" onClick={() => handleDeleteMessageById(item.id)}>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteMessageById(item?.id)}
                        >
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
                      </div>

                      <div
                        style={{
                          maxWidth: "400px",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <Typography
                          variant="body4"
                          style={{
                            fontSize: "12px",
                            color: "#9DA4AE",
                            fontWeight: "600",
                            paddingLeft: item?.mediaType === "image" && "10px",
                          }}
                        >
                          {item?.firstName}
                        </Typography>

                        {/* Content */}
                        {item?.mediaType === "image" ? (
                          <img
                            src={item?.text}
                            height={100}
                            width={100}
                            style={{
                              borderRadius: "5px",
                            }}
                            alt="Image"
                          />
                        ) : item?.mediaType === "video" ? (
                          <video src={item?.text} controls height={60} width={60}>
                            Your browser does not support the video tag.
                          </video>
                        ) : item?.mediaType === "audio" ? (
                          <audio src={item?.text} controls>
                            Your browser does not support the audio element.
                          </audio>
                        ) : item?.mediaType === "text" && isURL(item?.text) ? (
                          <></>
                        ) : (
                          <Typography style={{ color: "white" }}>{item?.text}</Typography>
                        )}
                      </div>
                    </div>
                  </Box>
                ))}

                <Box
                  sx={{
                    display: "flex",
                    alignSelf: "flex-end",
                    backgroundColor: "#35A6B1",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "max-content",
                    maxWidth: "300px",
                  }}
                >
                  <Typography style={{ color: "white" }}>Hello Again</Typography>
                </Box>
              </Box>
            </Card>
          </Stack>
        </Container>
        <MembersModal open={open} handleclose={handleClose} members={Data} />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
