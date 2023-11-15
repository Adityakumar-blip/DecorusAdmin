import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../utils/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const initialState = {};

export const getAllAdminUsers = createAsyncThunk(
  "getAllAdminUsers",
  async (values, { dispatch }) => {
    try {
      const result = await collection("users", getDocs());
      if (result) {
        return result?.data;
      } else {
        throw result?.data;
      }
    } catch (error) {
      dispatch(setError(error));
      throw error;
    }
  }
);

const AdminSlice = createSlice({
  name: "AdminSlice",
  initialState,
  reducers: {
    setSession: (state, action) => {},
    removeSession: (state, action) => {},
  },
  extraReducers(builder) {
    // builder.addCase(SignIn.fulfilled, (state, action) => {
    //   state.authenticated = true;
    //   localStorage.setItem("authenticated", true);
    // });
  },
});

export const {} = AdminSlice.actions;
export default AdminSlice.reducer;
