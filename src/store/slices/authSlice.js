import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth, db } from "src/contexts/firebase-context";
import { setLoading } from "./adminSlice";
import { getFirestore, collection, getDocs, where } from "firebase/firestore/lite";

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

export const SignIn = createAsyncThunk("auth/signIn", async (values, { dispatch }) => {
  try {
    const { email, password } = values;
    console.log("values", values);
    // Initialize Firebase Firestore
    const db = getFirestore();

    const usersCollection = collection(db, "users");
    const query = where("email", "==", email);
    const userSnapshot = await getDocs(collection(usersCollection, query));

    if (userSnapshot.empty) {
      // User doesn't exist
      return { status: "error", message: "User not found" };
    }

    const userData = userSnapshot.docs[0].data();

    if (password === userData.password) {
      if (userData.role.label === "superAdmin") {
        // Handle authentication success for superAdmin
        // You might want to store the user data in the Redux state here
        // and dispatch additional actions if needed
        return { status: "success", user: userData };
      } else {
        // Permission Denied
        return { status: "error", message: "Permission Denied" };
      }
    } else {
      // Password doesn't match
      return { status: "error", message: "Password incorrect" };
    }
  } catch (error) {
    console.error("Error", error);
    return { status: "error", message: "An error occurred while login" };
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
