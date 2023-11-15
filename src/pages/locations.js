import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addLocation,
  addRoles,
  getAllLocations,
  getAllRoles,
  getLocationById,
  updateLocation,
} from "src/store/slices/adminSlice";
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
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import CommonModal from "src/utils/common-modal";
import { useFormik } from "formik";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { CustomersTable } from "src/sections/customer/customers-table";
import useCustomers from "src/utils/use-customers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { LocationTable } from "src/sections/Locations/location-table";
import * as yup from "yup";
import { toast } from "react-hot-toast";

const initialValues = {
  location: "",
  ashram: [
    {
      ashramName: "",
    },
  ],
  isActive: true,
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [locationId, setLocationId] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm(initialValues);
    setOpen(false);
  };
  const dispatch = useDispatch();

  const Data = useSelector((state) => state.AdminSlice?.allLocations);

  const handleEvent = (eventId) => {
    if (eventId) {
      setLocationId(eventId);
      handleOpen();
    }
  };

  const customers = useCustomers(page, rowsPerPage, Data);

  useEffect(() => {
    dispatch(getAllLocations()).then((res) => {
      const loading = toast.loading("loading...");
      if (res) {
        toast.dismiss(loading);
      } else {
        toast.dismiss(loading);
        toast.error("An error occured while fetching the locations");
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
    role?.location?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilter = useCallback((val) => {
    setSearchValue(val);
  }, []);

  const initialValuesSchema = yup.object().shape({
    location: yup.string().required("Location is required"),
    ashram: yup
      .array()
      .of(
        yup.object().shape({
          ashramName: yup.string().required("Ashram Name is required"),
        })
      )
      .min(1, "At least one Ashram Name is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: initialValuesSchema,
    onSubmit: (values) => {
      const loading = toast.loading("Loading...");
      if (locationId) {
        const updatedValues = { ...values, id: locationId };
        dispatch(updateLocation(updatedValues)).then((result) => {
          toast.dismiss(loading);
        });
      } else {
        dispatch(addLocation(values))
          .then((result) => {
            if (result) {
              handleClose();
              dispatch(getAllLocations());
              toast.dismiss(loading);
              toast.success("Location added successfully");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  });

  useEffect(() => {
    dispatch(getLocationById(locationId)).then((res) => {
      if (res && res !== null) {
        console.log("location response is ", res);
        const locationEdit = res?.payload?.Data;
        formik.setFieldValue("location", locationEdit?.location);
        formik.setFieldValue("ashram", locationEdit?.ashrams);
        formik.setFieldValue("isActive", locationEdit?.isActive);
      }
    });
  }, [locationId]);

  console.log("locaiton formik values Are as follows", formik?.values);

  return (
    <>
      <Head>
        <title>Locations | Decorus</title>
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
                <Typography variant="h4">Locations</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleOpen}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                fullWidth
                placeholder="Search Location"
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
            <LocationTable
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
      <CommonModal
        name="Location"
        formikName="location"
        open={open}
        formik={formik}
        handleClose={handleClose}
        handleSubmit={formik.handleSubmit}
        handleBlur={formik.handleBlur}
        handleChange={formik.handleChange}
        edit={locationId && true}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
