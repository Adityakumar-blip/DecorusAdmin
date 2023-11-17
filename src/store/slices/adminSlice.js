import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../utils/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const initialState = {
  data: [],
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const collectionRef = collection(db, "users");
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const updateGroup = createAsyncThunk("updateGroup", async (values, { dispatch }) => {
  try {
    await collection(db, "users").doc(values.groupId).update(values.updatedUserData);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
});

export const deleteUserAsync = createAsyncThunk("users/deleteUser", async (id) => {
  const userDocRef = doc(db, "users", id);
  await deleteDoc(userDocRef);
  return id;
});

const AdminSlice = createSlice({
  name: "AdminSlice",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload;
    },
    updateUser: (state, action) => {
      const { id, newData } = action.payload;
      const userIndex = state.data.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        state.data[userIndex] = { ...state.data[userIndex], ...newData };
      }
    },
    deleteUser: (state, action) => {
      const id = action.payload;
      state.data = state.data.filter((user) => user.id !== id);
    },
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
