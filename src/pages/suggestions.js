import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEvent, getAllEvents, getAllMessages, updateEvent } from "src/store/slices/adminSlice";

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
import MessageModal from "src/utils/messages-modal";
import { SuggestionTable } from "src/sections/suggestions/suggestion-table";

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
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      setEventId("");
    }
  };

  const Data = useSelector((state) => state.AdminSlice?.suggestions);

  console.log("suggestions data::", Data);

  const customers = useCustomers(page, rowsPerPage, Data);

  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const filteredData = Data.filter((role) =>
    role?.roleName?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilter = useCallback((val) => {
    setSearchValue(val);
  }, []);

  return (
    <>
      <Head>
        <title>Suggestions | Decorus</title>
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
                <Typography variant="h4">Suggestions</Typography>
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
                placeholder="Search Suggestions"
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
            <SuggestionTable
              count={customers.totalCount}
              items={searchValue ? filteredData : customers.paginatedUsers}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Stack>
        </Container>
      </Box>
      <MessageModal open={open} handleclose={handleClose} />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
