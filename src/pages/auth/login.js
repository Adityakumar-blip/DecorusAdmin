import { useCallback, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SignIn } from "src/store/slices/authSlice";
import { SignInAPI } from "src/services/services";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      const loading = toast.loading("Loading...");
      dispatch(SignIn(values))
        .then((res) => {
          if (res) {
            router.push("/users");
            toast.dismiss(loading);
            toast.success(res?.payload?.data?.Message);
          } else {
            toast.dismiss(loading);
            toast.error("Permission denied");
          }
        })
        .catch((err) => {
          toast.dismiss(loading);
          console.log("sign in error", err);
          toast.error("An error occured");
        });
      // router.push("/users");
      // toast.dismiss(loading);
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <>
      <Head>
        <title>Login | Decorus</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              {/* <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography> */}
            </Stack>
            {/* <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
              <Tab label="Phone Number" value="phoneNumber" />
            </Tabs> */}

            <form noValidate onSubmit={formik.handleSubmit}>
              {method === "email" && (
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
              )}
              {method === "phoneNumber" && (
                <div>
                  <TextField
                    error={!!(formik.touched.phonenumber && formik.errors.phonenumber)}
                    fullWidth
                    helperText={formik.touched.phonenumber && formik.errors.phonenumber}
                    label="Phone Number"
                    name="phonenumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.phonenumber}
                  />
                </div>
              )}
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
