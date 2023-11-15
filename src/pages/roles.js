import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRoles, getAllRoles, getRoleById } from "src/store/slices/adminSlice";
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
import { RolesTable } from "src/sections/Roles/roles-table";
import DeleteModal from "src/utils/delete-modal";
import { toast } from "react-hot-toast";

const initialValues = {
  roleName: "",
  isActive: true,
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm(initialValues);
  };

  const dispatch = useDispatch();
  const id = localStorage.getItem("id");

  const Data = useSelector((state) => state.AdminSlice?.allRoles);

  const customers = useCustomers(page, rowsPerPage, Data);

  useEffect(() => {
    dispatch(getAllRoles());
  }, [dispatch]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const filteredData = Data.filter((role) =>
    role.roleName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilter = useCallback((val) => {
    setSearchValue(val);
  }, []);

  useEffect(() => {
    if (id) {
      // dispatch(getRoleById(id)).then((res) => {
      //   formik.setFieldValue("roleName", res?.roleName);
      // });
    }
  }, [dispatch, id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => {
      const loading = toast.loading("Loading...");
      dispatch(addRoles(values))
        .then((result) => {
          if (result) {
            handleClose();
            dispatch(getAllRoles());
            toast.dismiss(loading);
            toast.success("Role created successfully");
          } else {
            toast.dismiss(loading);
            toast.error("An error occured while creating the role");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      <Head>
        <title>Roles | Decorus</title>
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
                <Typography variant="h4">Roles</Typography>
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
            <RolesTable
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
      <CommonModal
        name="Role"
        formikName="roleName"
        open={open}
        handleClose={handleClose}
        handleSubmit={formik.handleSubmit}
        handleBlur={formik.handleBlur}
        handleChange={formik.handleChange}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
