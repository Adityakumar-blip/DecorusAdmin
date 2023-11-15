import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "src/contexts/firebase-context";
import { setLoading } from "./adminSlice";
import { SignInAPI, updateUserApi } from "src/services/services";

const ISSERVER = typeof window === "undefined";

var authenticated = false;

if (!ISSERVER) {
  // Access localStorage
  authenticated = localStorage.getItem("authenticated");
}

const initialState = {
  session: undefined,
  token: false,
  authenticated: authenticated ?? false,
};

export const SignIn = createAsyncThunk("SignIn", async (values, { getState, dispatch }) => {
  try {
    const result = await SignInAPI(values);
    if (result) {
      localStorage.setItem("user", JSON.stringify(result.data.Data));
      return result;
    } else {
      toast.error(result?.data?.Message);
      throw result;
    }
  } catch (error) {
    toast.dismiss(loading);
    if (error.response && error.response.status === 403) {
      toast.error("Access denied: You don't have permission to perform to login.");
    }
    throw error;
  }
});

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    setSession: (state, action) => {},
    removeSession: (state, action) => {},
  },
  extraReducers(builder) {
    builder.addCase(SignIn.fulfilled, (state, action) => {
      state.authenticated = true;
      localStorage.setItem("authenticated", true);
    });
  },
});

export const {} = AuthSlice.actions;
export default AuthSlice.reducer;
