import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEvent, getAllEvents, updateEvent } from "src/store/slices/adminSlice";

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
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";

const initialValues = {
  event: "",
  date: "",
  image: "",
  description: "",
  event_color: "",
  isActive: true,
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [eventId, setEventId] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      formik.resetForm(initialValues);
      setEventId("");
    }
  };
  const dispatch = useDispatch();

  const handleEvent = (eventId) => {
    if (eventId) {
      setEventId(eventId);
      handleOpen();
    }
  };

  const Data = useSelector((state) => state.AdminSlice?.allEvents);

  const customers = useCustomers(page, rowsPerPage, Data);

  useEffect(() => {
    dispatch(getAllEvents()).then((res) => {
      const loading = toast.loading("Loading...");
      if (res) {
        toast.dismiss(loading);
      }
    });
  }, [dispatch]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const filteredData = Data?.filter((role) =>
    role?.event?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilter = useCallback((val) => {
    setSearchValue(val);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => {
      const loading = toast.loading("Loading...");
      const data = new FormData();
      data.append("image", values["image"]);
      data.append("event", values["event"]);
      data.append("date", values["date"] ? values["date"] : new Date());
      data.append("isActive", values["isActive"]);
      data.append("event_color", values["event_color"]);
      data.append("description", values["description"]);
      if (eventId) {
        data.append("id", eventId);
      }
      if (eventId) {
        dispatch(updateEvent(data)).then((result) => {
          if (result) {
            handleClose();
            dispatch(getAllEvents());
            toast.dismiss(loading);
            toast.success("Event updated successfully");
          } else {
            toast.dismiss(loading);
            toast.error("An error occured while updating the event");
          }
        });
      } else {
        dispatch(addEvent(data))
          .then((result) => {
            if (result) {
              handleClose();
              dispatch(getAllEvents());
              toast.dismiss(loading);
              toast.success("Event added successfully");
            } else {
              toast.dismiss(loading);
              toast.error("An error occured while creating the event");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  });

  return (
    <>
      <Head>
        <title>Events | Decorus</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Events</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    handleOpen();
                  }}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                fullWidth
                placeholder="Search Events"
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
            <EventsTable
              count={customers.totalCount}
              items={searchValue ? filteredData : customers.paginatedUsers}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onData={handleEvent}
            />
          </Stack>
        </Container>
      </Box>
      <AddEventsModal
        name="Event"
        open={open}
        formik={formik}
        handleClose={handleClose}
        handleSubmit={formik.handleSubmit}
        handleBlur={formik.handleBlur}
        handleChange={formik.handleChange}
        id={eventId}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
