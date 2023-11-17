import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "react-hot-toast";
// import { db, auth } from "../../utils/firebaseconfig";
import { setLoading } from "./adminSlice";
import { getFirestore, collection, getDocs, where, query } from "firebase/firestore/lite";

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
    console.log("values", values);
    const { email, password } = values;
    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const query1 = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(query1);

    if (userSnapshot.empty) {
      // User doesn't exist
      return { status: "error", message: "User not found" };
    }

    const userData = userSnapshot.docs[0].data();
    console.log("User data info", userData);

    if (password === userData.password) {
      if (userData.role === "admin") {
        // Save authentication status to localStorage
        localStorage.setItem("authenticated", true);

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

    return { status: "error", message: "An error occurred while logging in" };
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
